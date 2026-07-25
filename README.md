# ScamShield AI — Intelligent Scam &amp; Phishing Detection Assistant

ScamShield AI is a production-ready, AI-powered cybersecurity web app that helps everyday internet users identify scams and phishing messages. Paste a suspicious email, SMS, WhatsApp message, social media DM, or bank alert, and get an instant risk score, scam category, a plain-English explanation of what the scammer is really after, and a clear safety plan.

> The app doesn't just say "phishing." It explains **why** a message is dangerous, in language anyone can understand.

---

## Problem Statement

Millions of people receive phishing emails, fake bank messages, WhatsApp scams, fake prize/delivery messages, OTP scams, crypto/investment/romance/job scams, and fake customer-support messages every day. Most users cannot distinguish a genuine message from a convincing fake. ScamShield AI acts as a personal cybersecurity assistant that explains the danger and tells you exactly what to do.

## Target Users

- Everyday internet users who aren't security experts
- Older relatives who are frequent scam targets
- Students and young professionals learning cyber awareness
- Anyone who receives a suspicious message and wants a second opinion before acting

## Features

- **AI Risk Analysis** — Google Gemini inspects every message for urgency, spoofing, credential harvesting, OTP requests, impersonation, and manipulation tactics.
- **Dynamic Risk Meter** — A 0–100 animated gauge with a Safe / Suspicious / Dangerous verdict that changes color dynamically.
- **Scam Category** — Bank Phishing, Prize Scam, Investment Scam, Delivery Scam, OTP Scam, Tech Support Scam, Romance Scam, Crypto Scam, and more.
- **Red Flags Checklist** — A clear list of every warning sign detected.
- **Psychological Tricks** — Badges for Fear, Greed, Urgency, Authority, Scarcity, Curiosity, and more.
- **What To Do** — Concrete, prioritized safety actions.
- **Safe Rewrite** — The AI rewrites the scam into plain English explaining what it's really trying to do.
- **Copy, Download (PDF), Share, and Clear** — Export or share any analysis.
- **Scan History** — Every scan is saved in your browser (localStorage), searchable and deletable.
- **Learn Page** — Educational deep-dives on 11 scam types with examples and safety tips.
- **Interactive Quiz** — 10 questions with explanations, a progress bar, and a downloadable **Cyber Safety Beginner** certificate (score 7+ to pass).
- **Responsive** — Works beautifully on desktop, tablet, and mobile.
- **Accessible** — Keyboard navigation, ARIA labels, reduced-motion support, and visible focus states.

## AI Functionality

When the user clicks **Analyze**, the message is:

1. **Sanitized** — control characters and excessive whitespace are stripped, and length is capped at 5,000 characters.
2. **Guarded against prompt injection** — the message is wrapped inside clear delimiters (`===== BEGIN UNTRUSTED MESSAGE =====`) and the model is instructed to treat it strictly as data, never as instructions.
3. **Sent to a secure Supabase Edge Function** — the Gemini API key lives only on the server and is **never** exposed to the browser.
4. **Analyzed by Google Gemini** with a cybersecurity system prompt, returning **strict JSON** matching this schema:

```json
{
  "riskLevel": "Safe | Suspicious | Dangerous",
  "riskScore": 0-100,
  "summary": "",
  "explanation": "",
  "redFlags": [],
  "recommendedActions": [],
  "messageType": "",
  "scamCategory": "",
  "psychologicalTactics": [],
  "confidence": "",
  "rewrite": "",
  "shouldReport": true,
  "shouldBlockSender": true
}
```

5. **Validated and normalized** — the edge function clamps the score to 0–100, coerces the risk level to one of the three allowed values, and ensures array fields are always arrays before returning to the client.

The AI **never** returns markdown — only JSON.

## Technologies Used

| Layer        | Tech                                                    |
| ------------ | ------------------------------------------------------- |
| Framework    | React 18 + TypeScript                                   |
| Build tool   | Vite                                                    |
| Styling      | Tailwind CSS + shadcn/ui                                |
| Animations   | Framer Motion                                           |
| Icons        | Lucide React                                            |
| Backend      | Supabase (Edge Functions)                               |
| AI           | Google Gemini 1.5 Flash                                 |
| PDF reports  | jsPDF                                                   |
| Hosting      | Vercel-ready static build                               |

## Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd scamshield-ai

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev

# 4. Build for production
npm run build

# 5. Preview the production build
npm run preview
```

## Environment Variables

The client app uses Supabase credentials that are provisioned automatically. Copy `.env.example` to `.env` and fill in your values if running outside the Bolt environment:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The **Gemini API key is NOT a client env var.** It is set as a Supabase Edge Function secret named `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`, defaulting to `gemini-1.5-flash`). Configure it via your Supabase dashboard under **Edge Functions → Secrets**, or via the Supabase MCP tools.

## Deployment

### Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in **Project Settings → Environment Variables**.
4. Set the Edge Function secret `GEMINI_API_KEY` in your Supabase project.
5. Deploy. Vercel runs `npm run build` and serves the static `dist/` output.

The `analyze` Edge Function is already deployed to Supabase; no additional server infrastructure is needed.

## Screenshots

> Add the following screenshots to your repo's `docs/` folder and reference them here:

- `docs/landing.png` — Landing page hero
- `docs/dashboard.png` — Message analyzer
- `docs/result-dangerous.png` — Dangerous risk result
- `docs/result-safe.png` — Safe risk result
- `docs/history.png` — Scan history
- `docs/learn.png` — Learn page
- `docs/quiz.png` — Cyber safety quiz
- `docs/certificate.png` — Completion certificate

## Folder Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── Analyzer.tsx        # Input form + result orchestration
│   ├── ActionToolbar.tsx   # Copy / Download / Share / Clear
│   ├── AdviceCard.tsx      # "What To Do" checklist
│   ├── ErrorBoundary.tsx
│   ├── Footer.tsx
│   ├── HistoryCard.tsx
│   ├── Loading.tsx
│   ├── Navbar.tsx
│   ├── PageHeader.tsx
│   ├── RedFlagsCard.tsx
│   ├── ResultCard.tsx      # Risk meter + summary + explanation
│   ├── RewriteCard.tsx
│   ├── RiskMeter.tsx       # Animated circular gauge
│   ├── TacticsCard.tsx     # Psychological tricks badges
│   └── ThemeProvider.tsx
├── hooks/
│   ├── useAnalyzer.ts
│   ├── useHashRoute.ts
│   ├── useHistory.ts
│   ├── useTheme.ts
│   └── use-toast.ts
├── pages/
│   ├── About.tsx
│   ├── Dashboard.tsx
│   ├── History.tsx
│   ├── Landing.tsx
│   ├── Learn.tsx
│   └── Quiz.tsx
├── services/
│   └── analyze.ts          # Calls the edge function
├── types/
│   └── index.ts            # AnalysisResult schema
├── utils/
│   ├── learnContent.ts
│   ├── quizContent.ts
│   ├── report.ts           # PDF + clipboard + share
│   ├── risk.ts
│   ├── sanitize.ts         # Sanitize + prompt-injection guard
│   └── storage.ts          # localStorage history/theme
├── App.tsx
├── main.tsx
├── index.css
└── App.css
supabase/
└── functions/
    └── analyze/
        └── index.ts        # Gemini proxy (server-side key)
```

## Security

- The Gemini API key is **never** shipped to the browser — it lives only in the Supabase Edge Function.
- User input is sanitized and capped at 5,000 characters.
- User content is wrapped in delimiters before being sent to the model to resist prompt injection.
- The AI is explicitly instructed to treat the message as untrusted data and to ignore any embedded instructions.
- Scan history is stored locally in the browser, never on the server.
- Messages are analyzed and discarded — they are not persisted.

## Future Improvements

- Browser extension for one-click analysis of emails and DMs in-context
- Image/URL-only analysis (OCR + link reputation)
- Multi-language support
- Community-reported scam signature database
- Per-account cloud history with optional sign-in
- SMS forwarding number for direct message analysis

## License

Released under the **MIT License**. See `LICENSE` for details.

---

Built for a safer internet. Made with AI.
