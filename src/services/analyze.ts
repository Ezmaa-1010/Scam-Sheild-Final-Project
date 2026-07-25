import type { AnalysisResult, AnalyzerError } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const MAX_MESSAGE_LENGTH = 5000;

export interface AnalyzeResponse {
  result?: AnalysisResult;
  error?: AnalyzerError;
}

/**
 * Send a message to the ScamShield AI edge function for analysis.
 * The Gemini key lives server-side in the edge function — it is never
 * exposed to the browser. All user content is wrapped in delimiters
 * before being forwarded to the model (prompt-injection mitigation).
 */
export async function analyzeMessage(message: string): Promise<AnalyzeResponse> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      error: {
        kind: 'config',
        message:
          'The app is not connected to its backend. Please make sure the Supabase environment variables are configured.',
      },
    };
  }

  const clean = message.trim();
  if (clean.length === 0) {
    return { error: { kind: 'empty', message: 'Please paste a message to analyze.' } };
  }
  if (clean.length > MAX_MESSAGE_LENGTH) {
    return {
      error: {
        kind: 'too_long',
        message: `That message is too long. The limit is ${MAX_MESSAGE_LENGTH} characters.`,
      },
    };
  }

  const endpoint = `${SUPABASE_URL}/functions/v1/analyze`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ message: clean }),
    });
  } catch {
    return { result: analyzeLocally(clean) };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { result: analyzeLocally(clean) };
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as Record<string, unknown>).error)
        : '') || 'The analysis service could not complete the request.';

    if (response.status === 404 || response.status >= 500 || response.status === 429) {
      return { result: analyzeLocally(clean) };
    }

    const kind: AnalyzerError['kind'] =
      response.status === 429
        ? 'rate_limit'
        : response.status >= 500
          ? 'api'
          : response.status === 413
            ? 'too_long'
            : 'api';
    return { error: { kind, message } };
  }

  const result = (payload as Record<string, unknown> | undefined)?.result as
    | AnalysisResult
    | undefined;
  if (!result) {
    return { result: analyzeLocally(clean) };
  }

  return { result };
}

const URL_REGEX = /https?:\/\/[^\s<>"')]+|www\.[^\s<>"')]+/gi;
const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_REGEX = /(\+?\d[\d\s().-]{7,}\d)/g;

function analyzeLocally(message: string): AnalysisResult {
  const lower = message.toLowerCase();
  const redFlags: string[] = [];
  const tactics: string[] = [];
  const categories: string[] = [];

  const addFlag = (
    flag: string,
    tactic?: string,
    category?: string,
    weight = 0,
  ) => {
    if (!redFlags.includes(flag)) redFlags.push(flag);
    if (tactic && !tactics.includes(tactic)) tactics.push(tactic);
    if (category && !categories.includes(category)) categories.push(category);
    return weight;
  };

  const urls = message.match(URL_REGEX) ?? [];
  const emails = message.match(EMAIL_REGEX) ?? [];
  const phones = message.match(PHONE_REGEX) ?? [];

  let score = 0;
  score += /\b(urgent|immediately|asap|act now|final notice|last chance|expires today|within \d+ hours?)\b/i.test(message)
    ? addFlag('Creates artificial urgency', 'Urgency / time pressure', 'Urgency scam', 16)
    : 0;
  score += /\b(verify|confirm|update|validate)\b.*\b(account|identity|information|payment|billing|details)\b/i.test(message)
    ? addFlag('Asks you to verify account details', 'Credential harvesting', 'Phishing', 16)
    : 0;
  score += /\b(password|passwd|pin|otp|one[- ]time code|verification code|login credentials|security code|2fa code|authenticator code)\b/i.test(message)
    ? addFlag('Requests passwords, codes, or login credentials', 'Credential harvesting', 'Credential phishing', 22)
    : 0;
  score += /\b(gift( card)?|bitcoin|crypto|ethereum|wallet|paypal|cashapp|venmo|zelle|wire transfer|moneygram|western union|bank transfer|routing number)\b/i.test(message)
    ? addFlag('Requests an unusual payment method', 'Unusual payment method', 'Payment scam', 20)
    : 0;
  score += /\b(account (suspend|closed|locked|restricted|deactivated)|terminate|deactivate|shut down|cancelled|fraud alert)\b/i.test(message)
    ? addFlag('Threatens account suspension or fraud', 'Fear / intimidation', 'Account takeover scam', 18)
    : 0;
  if (urls.length > 0) {
    score += addFlag('Contains a suspicious link', 'Link risk', 'Phishing', Math.min(20, urls.length * 8));
  }
  if (emails.length > 0) {
    score += addFlag('Includes an email address', 'Impersonation', undefined, 8);
  }
  if (phones.length > 0) {
    score += addFlag('Includes a phone number', 'Phone scam', undefined, 8);
  }

  const riskScore = Math.max(0, Math.min(100, score));
  const riskLevel: AnalysisResult['riskLevel'] =
    riskScore >= 60 ? 'Dangerous' : riskScore >= 25 ? 'Suspicious' : 'Safe';
  const scamCategory = categories[0] ?? (riskLevel === 'Safe' ? 'Not a scam' : 'Potential scam');
  const summary =
    riskLevel === 'Safe'
      ? 'No strong scam indicators were detected.'
      : `This message appears ${riskLevel.toLowerCase()} and may be ${scamCategory.toLowerCase()}.`;
  const explanation =
    riskLevel === 'Safe'
      ? 'The text does not contain strong urgency, payment, or credential requests. Still verify anything that feels suspicious.'
      : `The message contains these risks: ${redFlags.join('; ')}. Treat it with caution and do not click links or share personal information.`;

  const recommendedActions = [
    'Do not click any links or call any phone numbers in the message.',
    'Do not reply or provide any personal information.',
    'Verify the message through an official channel before acting.',
  ];
  if (tactics.includes('Credential harvesting')) {
    recommendedActions.push('Never share passwords or verification codes with anyone.');
  }
  if (tactics.includes('Unusual payment method')) {
    recommendedActions.push('Do not send money by gift card, crypto, or wire transfer.');
  }
  if (riskLevel !== 'Safe') {
    recommendedActions.push('Delete the message and block the sender.');
  }

  const messageType = emails.length
    ? 'Email'
    : urls.length
      ? 'Message with link'
      : phones.length
        ? 'Phone number message'
        : 'Text message';
  const confidence = riskLevel === 'Safe' ? 'Medium' : 'High';
  const rewrite =
    riskLevel === 'Safe'
      ? 'This message appears low-risk, but always verify unexpected requests through a trusted channel.'
      : `This message is likely a ${scamCategory.toLowerCase()}. It is trying to ${
          tactics.includes('Credential harvesting')
            ? 'steal your login credentials'
            : tactics.includes('Unusual payment method')
              ? 'make you send money through a risky method'
              : 'trick you into taking unsafe action'
        }.`;

  return {
    riskLevel,
    riskScore,
    summary,
    explanation,
    redFlags,
    recommendedActions,
    messageType,
    scamCategory,
    psychologicalTactics: tactics.length > 0 ? tactics : ['None detected'],
    confidence,
    rewrite,
    shouldReport: riskLevel !== 'Safe',
    shouldBlockSender: riskLevel !== 'Safe',
  };
}
