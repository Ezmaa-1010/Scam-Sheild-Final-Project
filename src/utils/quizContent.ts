export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'You get an email: "Your account will be closed in 24 hours, verify now." What is the safest first step?',
    options: [
      'Click the link and verify quickly to save your account',
      'Open the company website by typing the URL yourself and check for alerts',
      'Reply to the email asking if it is real',
      'Forward it to all your contacts to warn them',
    ],
    correctIndex: 1,
    explanation: 'Never trust links in urgent emails. Go to the site manually — real providers also notify you there.',
  },
  {
    id: 2,
    question: 'A "bank agent" calls about fraud and asks you to read back the OTP they just sent. You should:',
    options: [
      'Read it back — they are from your bank and trying to help',
      'Read it back but only after confirming the caller ID looks right',
      'Never share the OTP; hang up and call the bank on the number from your card',
      'Ask them to email you a request first',
    ],
    correctIndex: 2,
    explanation: 'Banks never ask for OTPs. Anyone requesting an OTP is attempting to bypass your security.',
  },
  {
    id: 3,
    question: 'Which of these is the strongest sign a WhatsApp message is a scam?',
    options: [
      'It uses emojis',
      'A new number claims to be your child and urgently asks for money',
      'It arrives in the evening',
      'It contains a greeting',
    ],
    correctIndex: 1,
    explanation: 'Family impersonation from a new number, combined with urgency and money, is a classic scam pattern.',
  },
  {
    id: 4,
    question: 'An online love interest you have never met asks for gift cards to "sort out a visa". This is likely:',
    options: [
      'A normal request in a long-distance relationship',
      'A romance scam — never send money or gift cards to someone you have only met online',
      'Safe because gift cards are not "real money"',
      'Fine as long as they promise to repay you',
    ],
    correctIndex: 1,
    explanation: 'Romance scammers build trust over time then invent emergencies. Gift cards are untraceable and irreversible.',
  },
  {
    id: 5,
    question: 'You see "Send 1 ETH, get 2 ETH back" from an account using a celebrity\'s name and photo. This is:',
    options: [
      'A legitimate promotion if the account is verified-looking',
      'A crypto giveaway scam — real celebrities do not double your crypto',
      'Safe if the link looks like Twitter',
      'Worth trying with a small amount first',
    ],
    correctIndex: 1,
    explanation: 'Crypto giveaway scams clone celebrity accounts. Crypto transfers cannot be reversed, so "test with a small amount" still loses money.',
  },
  {
    id: 6,
    question: 'Which email address is most likely a phishing attempt?',
    options: [
      'noreply@paypal.com',
      'support@paypa1.com (with a number 1 instead of the letter l)',
      'team@stripe.com',
      'alerts@yourbank.co.uk',
    ],
    correctIndex: 1,
    explanation: 'Lookalike domains with swapped characters (paypa1 vs paypal) are a hallmark of phishing. Always read the full address.',
  },
  {
    id: 7,
    question: 'A QR code sticker is placed over the real one on a parking meter. The risk is:',
    options: [
      'None — QR codes are always safe to scan',
      'It may send payment to a scammer instead of the parking operator',
      'It will only open a harmless website',
      'Your phone cannot be harmed by QR codes',
    ],
    correctIndex: 1,
    explanation: 'Malicious QR codes can route payments or open phishing pages. Inspect codes for tampering and preview the URL.',
  },
  {
    id: 8,
    question: 'A "brand" offers you a paid Instagram collaboration but asks for your password to send products. You should:',
    options: [
      'Send it — they need access to ship to you',
      'Send a temporary password instead',
      'Refuse — real brands never need your password; report the account',
      'Ask for their email first, then send it',
    ],
    correctIndex: 2,
    explanation: 'No legitimate brand needs your password. Account-takeover scams disguise themselves as collaboration offers.',
  },
  {
    id: 9,
    question: 'You receive an OTP you did not request. The best action is:',
    options: [
      'Ignore it — it is probably nothing',
      'Forward it to friends to check',
      'Treat it as a warning: someone may be trying to log in as you. Do not share it; secure the account',
      'Reply STOP to the number that sent it',
    ],
    correctIndex: 2,
    explanation: 'An unrequested OTP often means someone has your password and is trying the second step. Change your password immediately.',
  },
  {
    id: 10,
    question: 'Which is the strongest general rule for suspicious messages?',
    options: [
      'If it looks urgent, act first and think later',
      'If a friend sent the link, it must be safe',
      'Slow down, verify through a separate trusted channel, and never act under pressure',
      'If the logo looks correct, the sender is genuine',
    ],
    correctIndex: 2,
    explanation: 'Urgency and trust are the two main weapons of scammers. Pausing and verifying through another channel defeats most attacks.',
  },
];
