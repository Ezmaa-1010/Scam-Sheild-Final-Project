// Local heuristic scam-detection engine. Used as a fallback when the Gemini
// AI service is unavailable (rate-limited, down, or misconfigured). Produces
// the same result schema as the AI analyzer so the client UI is unchanged.

interface HeuristicResult {
  riskLevel: "Safe" | "Suspicious" | "Dangerous";
  riskScore: number;
  summary: string;
  explanation: string;
  redFlags: string[];
  recommendedActions: string[];
  messageType: string;
  scamCategory: string;
  psychologicalTactics: string[];
  confidence: string;
  rewrite: string;
  shouldReport: boolean;
  shouldBlockSender: boolean;
}

const URL_REGEX = /https?:\/\/[^\s<>"')]+|www\.[^\s<>"')]+/gi;
const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_REGEX = /(\+?\d[\d\s().-]{7,}\d)/g;

interface Rule {
  id: string;
  pattern: RegExp;
  flag: string;
  tactic?: string;
  weight: number;
  category?: string;
}

const RULES: Rule[] = [
  // Urgency / pressure
  { id: "urgent", pattern: /\b(urgent|immediately|right now|asap|act now|final notice|last chance|expires today|within 24 hours?|before it(?:'s| is) too late)\b/i, flag: "Creates false urgency to pressure you into acting quickly", tactic: "Urgency / time pressure", weight: 15 },
  { id: "deadline_threat", pattern: /\b(within \d+ hours?|by (today|tomorrow|tonight)|deadline|time.?sensitive)\b/i, flag: "Imposes an artificial deadline", tactic: "Artificial deadline", weight: 10 },

  // Threats / fear
  { id: "account_suspended", pattern: /\b(account.{0,20}(suspend|close|terminat|deactivat|lock|restrict|disabled)|your account will be)\b/i, flag: "Threatens account suspension or closure", tactic: "Intimidation / fear", weight: 18, category: "Account takeover scam" },
  { id: "legal_threat", pattern: /\b((legal|court|lawsuit|arrest|warrant|jail|prison|police|fbi|irs|tax|penalt|fine|prosecut)\b.{0,40}(action|taken|proceed|filed|issued|pending))/i, flag: "Threatens legal action or arrest", tactic: "Intimidation / fear", weight: 20, category: "Government impersonation scam" },
  { id: "service_cutoff", pattern: /\b(service.{0,20}(disconnect|terminat|cancel|interrupt)|utilities? .{0,20}(shut off|disconnected)|eviction|repossession)\b/i, flag: "Threatens to cut off a service", tactic: "Intimidation / fear", weight: 15 },

  // Money / payment
  { id: "gift_card", pattern: /\b(gift cards?|google play cards?|apple cards?|itunes cards?|amazon cards?|steam cards?|vanilla cards?|paypal cards?|google pay cards?)\b/i, flag: "Requests payment via gift cards — a major scam red flag", tactic: "Unusual payment method", weight: 25, category: "Gift card scam" },
  { id: "crypto", pattern: /\b(bitcoin|btc|ethereum|eth|crypto|wallet address|seed phrase|send .{0,20}(coin|token|usdt|tether))\b/i, flag: "Requests cryptocurrency — irreversible and untraceable", tactic: "Unusual payment method", weight: 22, category: "Cryptocurrency scam" },
  { id: "wire_transfer", pattern: /\b(wire (transfer|money)|moneygram|western union|zelle|venmo|cashapp|cash app|bank transfer|routing number)\b/i, flag: "Requests a wire or money transfer", tactic: "Unusual payment method", weight: 18, category: "Payment scam" },
  { id: "fee_advance", pattern: /\b((processing|transfer|clearance|release|custom|duty|tax) fee|advance (fee|payment)|upfront payment|pay .{0,20}(fee|charge|tax) .{0,20}(release|claim|receive))\b/i, flag: "Requests an upfront fee before releasing funds", tactic: "Advance fee fraud", weight: 22, category: "Advance fee scam" },

  // Credential harvesting
  { id: "credentials", pattern: /\b(password|passwd|pin|otp|one.?time (code|password)|verification code|security code|login credentials|2fa code|authenticator code)\b/i, flag: "Requests passwords, codes, or credentials — legitimate services never ask for these", tactic: "Credential harvesting", weight: 25, category: "Credential phishing" },
  { id: "pii", pattern: /\b(ssn|social security|date of birth|dob|mother'?s maiden name|full name .{0,20}(address|dob)|national id|passport number|driver'?s license)\b/i, flag: "Requests sensitive personal information", tactic: "Information harvesting", weight: 18, category: "Identity theft" },
  { id: "bank_info", pattern: /\b(account number|card number|cvv|cvc|expiry date|bank account|debit card|credit card number|full card details)\b/i, flag: "Requests banking or card details", tactic: "Financial harvesting", weight: 22, category: "Bank impersonation scam" },
  { id: "verify_link", pattern: /\b(verify .{0,20}(account|identity|information)|confirm .{0,20}(details|identity)|update .{0,20}(payment|billing|info|information)|validate .{0,20}(account|email))\b/i, flag: "Asks you to 'verify' or 'confirm' details via a link", tactic: "Phishing via verification pretext", weight: 16 },

  // Suspicious links
  { id: "url_shortener", pattern: /(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|rebrand\.ly|cutt\.ly|shorturl\.at|rb\.gy)/i, flag: "Contains a shortened URL that hides the real destination", weight: 12 },
  { id: "suspicious_tld", pattern: /\.(ru|tk|ml|ga|cf|cn|top|xyz|click|link|country|stream|download|review|men|party|loan|work|gdn|kim|date|trade|cam|bet|science|accountant|bid|cricket|faith|rugby|racing|download)\b/i, flag: "Contains a link to a domain with a high-risk extension", weight: 15 },

  // Impersonation
  { id: "impersonation_brand", pattern: /\b(netflix|amazon|apple|google|microsoft|paypal|facebook|instagram|whatsapp|linkedin|twitter|x\.com|ebay|fedex|ups|usps|dhl|royal mail|hsbc|chase|bank of america|wells fargo|barclays|santander)\b/i, flag: "Claims to be from a well-known company", tactic: "Brand impersonation", weight: 8 },
  { id: "impersonation_govt", pattern: /\b(irs|hmrc|social security administration|medicare|medicaid|government|fbi|police|dea|customs|border patrol|hmrc|ato|cra|inland revenue)\b/i, flag: "Claims to be from a government agency", tactic: "Authority impersonation", weight: 14, category: "Government impersonation scam" },
  { id: "impersonation_bank", pattern: /\b(your bank|our bank|security team|fraud (team|department|alert)|unauthorized (transaction|charge|purchase) .{0,30}(your|on your) account)\b/i, flag: "Claims to be your bank's fraud or security team", tactic: "Authority impersonation", weight: 16, category: "Bank impersonation scam" },

  // Rewards / too good to be true
  { id: "lottery_prize", pattern: /\b((you(?:'ve| have) (won|been selected)|congratulations?|winner|prize|lottery|sweepstakes|raffle|draw|inheritance|beneficiary|next of kin|unclaimed funds?|dormant account|sum of .{0,20}(dollars?|usd|euros?|pounds?)))\b/i, flag: "Claims you won a prize or inherited money", tactic: "Reward / greed appeal", weight: 20, category: "Lottery / prize scam" },
  { id: "refund", pattern: /\b(refund|reimburse|compensation|overcharge|double charge|credit back|money back|cashback)\b/i, flag: "Offers a refund or compensation you weren't expecting", tactic: "Reward / greed appeal", weight: 12, category: "Refund scam" },
  { id: "job_offer", pattern: /\b(job offer|work from home|easy money|earn .{0,15}(per (week|day|hour)|weekly|daily)|mystery shopper|package forwarding|personal assistant|data entry .{0,15}(no experience))\b/i, flag: "Offers easy money or a too-good job", tactic: "Reward / greed appeal", weight: 16, category: "Job scam" },
  { id: "investment", pattern: /\b(guaranteed (return|profit|income)|risk.?free investment|double your (money|investment|crypto)|trading signals?|forex .{0,15}(investment|trading|signal)|high yield|roi .{0,10}\d+%)\b/i, flag: "Promises guaranteed or high returns with no risk", tactic: "Reward / greed appeal", weight: 18, category: "Investment scam" },

  // Romance / social engineering
  { id: "new_number", pattern: /\b(texting from (a |my )?(new|friend|different|another)'?s? number|new number|lost my phone|dropped my phone|broke my phone|phone (broke|damaged|broken)|using a friend'?s phone|borrowed a phone)\b/i, flag: "Claims to be texting from a new or borrowed number — a common impersonation tactic", tactic: "Impersonation via new number", weight: 20, category: "Impersonation scam" },
  { id: "romance", pattern: /\b((fall in love|soul ?mate|dear .{0,10}i love you|missing you|can'?t stop thinking|deployed (soldier|military|army)|widow|widower|orphan|god fearing|am .{0,30}(military|army|marine|soldier|deployed|peacekeeping))\b)/i, flag: "Uses romance or emotional bonding language", tactic: "Emotional manipulation", weight: 15, category: "Romance scam" },
  { id: "authority_demand", pattern: /\b(do not (contact|tell|inform|call) (anyone|anybody)|keep this (confidential|secret|private)|do not .{0,20}(hang up|disconnect|tell anyone)|don'?t call me|do not call me)\b/i, flag: "Tells you to keep it secret or not contact anyone", tactic: "Isolation / secrecy", weight: 20 },

  // Delivery / package
  { id: "delivery", pattern: /\b(package (held|waiting|undeliverable|seized)|delivery (attempt|failed|pending)|customs (fee|charge|hold)|parcel .{0,15}(held|waiting|fee)|shipping (fee|charge|update)|track your (package|parcel|order))\b/i, flag: "Claims a package is held or needs a fee", tactic: "Urgency / fear", weight: 14, category: "Delivery scam" },

  // Remote access / tech support
  { id: "remote_access", pattern: /\b((install|download) .{0,20}(software|app|program|tool)|remote (access|desktop|connection)|teamviewer|anydesk|logmein|screen sharing|allow access to your (computer|device|pc))\b/i, flag: "Requests remote access to your device", tactic: "Technical manipulation", weight: 22, category: "Tech support scam" },
  { id: "malware_claim", pattern: /\b((virus|malware|trojan|spyware|ransomware) .{0,20}(detected|found|infected|on your|warning)|your (computer|pc|device|phone) (is|has been) (infected|compromised|hacked|blocked)|ip address .{0,20}(compromised|used))\b/i, flag: "Claims your device is infected with malware", tactic: "Fear / tech scare", weight: 18, category: "Tech support scam" },

  // Generic / low-trust signals
  { id: "generic_greeting", pattern: /\b(dear (customer|user|sir|madam|valued customer|account holder|client)|hi (user|customer|there))\b/i, flag: "Uses a generic greeting instead of your name", weight: 8 },
  { id: "excessive_caps", pattern: /\b(UURGENT|WARNING|ALERT|NOTICE|FINAL|IMMEDIATE|ATTENTION|DANGER)[\s!]/i, flag: "Uses alarming capitalised words", tactic: "Urgency / fear", weight: 6 },
  { id: "poor_grammar", pattern: /\b(i am?( .{0,5})?(writing|contacting|reaching) (you|to (inform|let you know))|kindly|i will like to|please i want|am mr\.?|am mrs\.?|i expect your (urgent|immediate)|reply me back)\b/i, flag: "Unusual phrasing common in scam messages", weight: 8 },
  { id: "stop_reply", pattern: /\b(reply (stop|no|unsubscribe) .{0,15}(cancel|opt|stop)|text stop to cancel|reply stop)\b/i, flag: "Includes a fake 'reply STOP' to seem legitimate", weight: 6 },
];

const RECOMMENDED_ACTIONS: Record<string, string[]> = {
  base: [
    "Do not click any links or call any phone numbers in the message.",
    "Do not reply or provide any personal information.",
    "If you are unsure, contact the organisation directly using details from their official website — not the ones in this message.",
    "Delete the message and block the sender.",
  ],
  credentials: [
    "Never share passwords, one-time codes, or 2FA codes with anyone — no legitimate service will ever ask.",
    "If you already shared credentials, change your password immediately and enable two-factor authentication.",
    "Check your accounts for unauthorised activity.",
  ],
  payment: [
    "Never pay with gift cards, cryptocurrency, or wire transfers to someone you cannot verify.",
    "Gift cards and crypto payments cannot be reversed — once sent, the money is gone.",
  ],
  report: [
    "Report this message to your local fraud authority (e.g. Action Fraud, FTC, or your national equivalent).",
    "Forward suspicious texts to your carrier's spam reporting number if available.",
  ],
};

export function localAnalyze(message: string): HeuristicResult {
  const lower = message.toLowerCase();
  const matched: Rule[] = [];

  for (const rule of RULES) {
    if (rule.pattern.test(message) || rule.pattern.test(lower)) {
      matched.push(rule);
      // Reset lastIndex for global regexes so re-testing works
      rule.pattern.lastIndex = 0;
    }
  }

  const urls = message.match(URL_REGEX) ?? [];
  const emails = message.match(EMAIL_REGEX) ?? [];
  const phones = message.match(PHONE_REGEX) ?? [];

  // Score: sum of matched rule weights, capped at 100
  let score = matched.reduce((sum, r) => sum + r.weight, 0);

  // Bonus for multiple suspicious URLs
  if (urls.length > 0) score += Math.min(urls.length * 4, 12);
  // Bonus for both a URL and urgency
  if (urls.length > 0 && matched.some((r) => r.id === "urgent")) score += 8;

  score = Math.max(0, Math.min(100, score));

  const riskLevel: HeuristicResult["riskLevel"] =
    score >= 60 ? "Dangerous" : score >= 25 ? "Suspicious" : "Safe";

  const redFlags = [...new Set(matched.map((r) => r.flag))];
  const tactics = [...new Set(matched.map((r) => r.tactic).filter(Boolean))] as string[];

  const categories = [...new Set(matched.map((r) => r.category).filter(Boolean))] as string[];
  const scamCategory = categories.length > 0 ? categories[0] : riskLevel === "Safe" ? "Not a scam" : "General phishing / scam attempt";

  // Build recommended actions
  const actions = [...RECOMMENDED_ACTIONS.base];
  if (matched.some((r) => r.category === "Credential phishing" || r.id === "credentials")) {
    actions.push(...RECOMMENDED_ACTIONS.credentials);
  }
  if (matched.some((r) => r.id === "gift_card" || r.id === "crypto" || r.id === "wire_transfer" || r.id === "fee_advance")) {
    actions.push(...RECOMMENDED_ACTIONS.payment);
  }
  if (riskLevel !== "Safe") {
    actions.push(...RECOMMENDED_ACTIONS.report);
  }

  // Detect message type
  let messageType = "Text message";
  if (emails.length > 0) messageType = "Email";
  else if (urls.length > 0) messageType = urls.length > 1 ? "Email / link message" : "Message with link";
  else if (phones.length > 0) messageType = "Phone number message";
  if (/^(hi|hey|hello|dear)\b/i.test(message) && matched.some((r) => r.id === "romance")) messageType = "Social / dating message";

  const confidence = riskLevel === "Safe" ? "Medium" : "High";

  const summary = buildSummary(riskLevel, scamCategory, matched, urls);
  const explanation = buildExplanation(riskLevel, scamCategory, matched, urls, emails, phones);
  const rewrite = buildRewrite(riskLevel, scamCategory, matched);

  return {
    riskLevel,
    riskScore: score,
    summary,
    explanation,
    redFlags,
    recommendedActions: actions,
    messageType,
    scamCategory,
    psychologicalTactics: tactics.length > 0 ? tactics : ["None detected"],
    confidence,
    rewrite,
    shouldReport: riskLevel !== "Safe",
    shouldBlockSender: riskLevel !== "Safe",
  };
}

function buildSummary(
  level: HeuristicResult["riskLevel"],
  category: string,
  matched: Rule[],
  urls: string[],
): string {
  if (level === "Safe") {
    return "This message does not show typical signs of a scam, but stay cautious if anything feels off.";
  }
  const topReason = matched[0]?.flag ?? "suspicious patterns";
  const linkNote = urls.length > 0 ? ` It contains ${urls.length === 1 ? "a suspicious link" : `${urls.length} suspicious links`}.` : "";
  return `This message is ${level.toLowerCase()} — it appears to be a ${category.toLowerCase()}. ${topReason}.${linkNote}`;
}

function buildExplanation(
  level: HeuristicResult["riskLevel"],
  category: string,
  matched: Rule[],
  urls: string[],
  emails: string[],
  phones: string[],
): string {
  if (level === "Safe") {
    return "No common scam indicators were detected: no urgency language, no requests for money or credentials, no suspicious links, and no impersonation tactics. Treat this as a low-risk message. If the content still seems unusual or out of context, trust your instincts and verify through a trusted channel.";
  }

  const reasons = matched.slice(0, 6).map((r) => `• ${r.flag}`);
  let extra = "";
  if (urls.length > 0) {
    extra += `\n\nThe message contains ${urls.length === 1 ? "a link" : `${urls.length} links`} (${urls.slice(0, 3).join(", ")}${urls.length > 3 ? ", …" : ""}). Do not open these — they may lead to fake websites designed to steal your information or install malware.`;
  }
  if (emails.length > 0) {
    extra += `\n\nIt includes an email address (${emails[0]}) — verify it against the organisation's official address before trusting it.`;
  }
  if (phones.length > 0) {
    extra += `\n\nIt includes a phone number (${phones[0]}) — do not call it; scammers run fake support lines.`;
  }

  return `This message was flagged as ${category}. Here are the key indicators:\n\n${reasons.join("\n")}${extra}\n\nThis is a ${level.toLowerCase()} message. Do not interact with it — do not click links, reply, call any numbers, or share any information.`;
}

function buildRewrite(
  level: HeuristicResult["riskLevel"],
  category: string,
  matched: Rule[],
): string {
  if (level === "Safe") {
    return "This message appears to be a normal, legitimate communication. No rewrite is needed.";
  }
  const intent = matched.some((r) => r.id === "credentials") ? "steal your passwords or login codes"
    : matched.some((r) => r.id === "gift_card" || r.id === "crypto" || r.id === "wire_transfer") ? "trick you into sending money through a method that cannot be reversed"
    : matched.some((r) => r.id === "lottery_prize" || r.id === "investment") ? "make you believe you can earn money, then steal fees or your investment"
    : matched.some((r) => r.id === "remote_access" || r.id === "malware_claim") ? "scare you into giving them remote access to your computer"
    : matched.some((r) => r.id === "romance") ? "build an emotional connection so they can eventually ask for money"
    : "steal your personal or financial information";

  return `In plain English: this is a ${category.toLowerCase()}. The sender is pretending to be someone trustworthy so they can ${intent}. Everything in the message — the urgency, the threats, the links, the promises — is designed to make you act before you have time to think. If you do what they ask, you could lose money, have your accounts hacked, or have your identity stolen. The safest response is to do nothing: don't click, don't reply, don't call, and delete the message.`;
}
