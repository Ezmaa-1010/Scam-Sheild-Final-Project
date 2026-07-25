export interface LearnTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  examples: string[];
  safetyTips: string[];
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'phishing',
    title: 'Phishing',
    icon: 'Mail',
    description:
      'Phishing emails pretend to be from trusted companies to steal your passwords, card details or identity. They usually mimic real brands with copied logos and near-identical sender addresses.',
    examples: [
      '"Your account will be suspended — verify now" with a link to a fake login page.',
      'A fake invoice for software you never bought, with an "unsubscribe" link that harvests credentials.',
      '"You have a new shared document" emails that lead to Microsoft/Google lookalike sign-in pages.',
    ],
    safetyTips: [
      'Hover over links before clicking and check the real URL — never trust the display text.',
      'Look for subtle domain typos like "paypa1.com" or "micros0ft-support.co".',
      'Never enter passwords after clicking an email link — go to the site manually.',
      'Check the sender\'s full email address, not just the display name.',
    ],
  },
  {
    id: 'bank-scams',
    title: 'Bank Scams',
    icon: 'Landmark',
    description:
      'Bank impersonation messages claim your account is locked, overdrawn or under fraud attack. The goal is panic — to make you "verify" credentials or authorise a transfer before you can think.',
    examples: [
      '"Suspicious transaction detected — confirm your details or your card will be blocked."',
      'A call or text with a one-time code you never requested, followed by a request to read it back.',
      'Fake refund offers that route you to a lookalike bank portal.',
    ],
    safetyTips: [
      'Banks never ask for your full password, PIN or OTP over phone, email or text.',
      'If worried, call the number on the back of your card — never one in the message.',
      'Log in through the official app or typed URL, never a link.',
      'Enable transaction alerts so you spot unauthorised activity instantly.',
    ],
  },
  {
    id: 'whatsapp-scams',
    title: 'WhatsApp Scams',
    icon: 'MessageCircle',
    description:
      'WhatsApp scams range from "hi Mum, I broke my phone" family impersonation to package delivery fees, investment tips from a "friend" and fake job offers. Trust is the weapon.',
    examples: [
      'A new number claiming to be your child, asking for urgent money for a new phone.',
      'A long-lost contact pitching a "guaranteed" crypto scheme with a referral link.',
      '"You\'ve won a prize — pay a small shipping fee to claim it."',
    ],
    safetyTips: [
      'Verify unexpected requests for money with a voice or video call.',
      'Be suspicious of any new number claiming to be someone you know.',
      'Never share OTPs sent to your phone with anyone, ever.',
      'Turn on two-step verification in WhatsApp settings.',
    ],
  },
  {
    id: 'instagram-scams',
    title: 'Instagram Scams',
    icon: 'Instagram',
    description:
      'Instagram DMs lure victims with fake brand collaborations, account-verification warnings, crypto giveaways and romance baiting. Many lead to phishing pages that steal login codes.',
    examples: [
      '"Your account is flagged for violations — verify identity here to avoid removal."',
      'A "brand" offering paid collaboration, then asking for a fee or login to send products.',
      '"I\'ve moved to a new platform, add me here" with a malicious link.',
    ],
    safetyTips: [
      'Instagram never contacts you by DM about account issues.',
      'Real brands don\'t ask for fees or your password to collaborate.',
      'Check verified badges and follower history before trusting an account.',
      'Enable two-factor authentication on your account.',
    ],
  },
  {
    id: 'facebook-scams',
    title: 'Facebook Scams',
    icon: 'Facebook',
    description:
      'Facebook Messenger scams hijack accounts to message friends with "I got a government grant", fake marketplace deals and malicious video links. Because they come from a known person, they bypass suspicion.',
    examples: [
      'A friend\'s account messages you about a grant you "qualify for" — just pay processing fees.',
      'A too-good marketplace listing that asks for payment by gift cards or crypto.',
      'A link to "see who viewed your profile" that steals your login.',
    ],
    safetyTips: [
      'Be wary of sudden money-making offers from friends — their account may be hacked.',
      'Never pay by gift card, wire or crypto to a stranger online.',
      'Confirm unusual requests through another channel before acting.',
      'Report compromised accounts to Facebook immediately.',
    ],
  },
  {
    id: 'investment-scams',
    title: 'Investment Scams',
    icon: 'TrendingUp',
    description:
      'Investment scams promise high, guaranteed returns with low risk. They use fake testimonials, pressure to "act now", and often show a fake dashboard that lets you withdraw small amounts before blocking big ones.',
    examples: [
      '"I turned £500 into £12,000 in a week — here\'s my strategy" with a referral link.',
      'Cold messages about exclusive crypto, forex or gold opportunities closing "tonight".',
      'A polished trading app that lets you withdraw once, then demands more deposits.',
    ],
    safetyTips: [
      'Guaranteed high returns with no risk do not exist.',
      'Check the firm on your country\'s financial regulator register before investing.',
      'Be suspicious of pressure, secrecy and referral bonuses.',
      'Never let anyone remotely control your device to "set up" an account.',
    ],
  },
  {
    id: 'crypto-scams',
    title: 'Crypto Scams',
    icon: 'Bitcoin',
    description:
      'Crypto scams exploit the irreversible, unregulated nature of transactions. Common forms: fake exchanges, giveaway doubling, romance-driven "investments", and pig-butchering schemes that build trust for weeks before the ask.',
    examples: [
      '"Send 0.5 ETH, get 1 ETH back" giveaway from a cloned celebrity account.',
      'A dating-app match who slowly introduces a "crypto opportunity" only they can manage.',
      'A fake wallet app that drains funds the moment you seed it.',
    ],
    safetyTips: [
      'Crypto transactions cannot be reversed — treat every send as final.',
      'Verify giveaways on the official account, never via a link.',
      'Use well-known exchanges and download wallet apps only from official stores.',
      'Be highly suspicious of any online romance that turns to money.',
    ],
  },
  {
    id: 'romance-scams',
    title: 'Romance Scams',
    icon: 'Heart',
    description:
      'Romance scammers build emotional intimacy over weeks or months, then fabricate emergencies that require money — medical bills, customs fees, travel costs. The victim\'s feelings are weaponised against their judgement.',
    examples: [
      'A suitor who is always "overseas" and can never video call, eventually asking for money.',
      'Requests for gift cards, wire transfers or crypto to "sort out a visa".',
      'A long-distance relationship that pivots to an "investment opportunity".',
    ],
    safetyTips: [
      'Never send money or gifts to someone you\'ve only met online.',
      'Reverse-image-search profile photos to check for stolen identities.',
      'Video calls are hard to fake — insist on one early.',
      'Be suspicious of anyone who moves very fast or avoids meeting.',
    ],
  },
  {
    id: 'otp-scams',
    title: 'OTP Scams',
    icon: 'KeyRound',
    description:
      'An OTP (one-time password) is a code that proves it\'s you. Scammers trick you into handing it over — the single most damaging thing you can share — letting them bypass two-factor authentication entirely.',
    examples: [
      '"I sent a code to the wrong number, can you read it back?"',
      'A "bank agent" calls about fraud and asks you to read the code they just triggered.',
      'A delivery text asks for an OTP "to confirm the parcel".',
    ],
    safetyTips: [
      'Never share any code with anyone, for any reason — even "your bank".',
      'Treat OTPs like your password: they grant access to your accounts.',
      'If you shared one, change that account\'s password immediately.',
      'Beware of OTPs you didn\'t request — someone may be trying to log in as you.',
    ],
  },
  {
    id: 'qr-scams',
    title: 'QR Scams',
    icon: 'QrCode',
    description:
      'Malicious QR codes — stuck on parking meters, fake posters, or sent in messages — route victims to phishing pages, payment apps or malware. Scanning feels harmless, which is exactly the trap.',
    examples: [
      'A sticker over a real parking-meter QR code that sends payment to a scammer.',
      'A "parcel tracking" QR in a text that opens a credential-harvesting page.',
      'A fake menu or poster QR that installs a malicious app.',
    ],
    safetyTips: [
      'Inspect QR codes for tampering or stickers placed on top.',
      'Preview the URL before opening it; watch for lookalike domains.',
      'Avoid scanning codes from unsolicited messages.',
      'Use your phone\'s built-in scanner rather than random third-party apps.',
    ],
  },
  {
    id: 'fake-shopping',
    title: 'Fake Shopping Scams',
    icon: 'ShoppingBag',
    description:
      'Fake online stores advertise luxury goods, electronics or pets at impossible prices. They take payment, send nothing (or a counterfeit), and vanish — often harvesting card details for later fraud.',
    examples: [
      'A "closing-down sale" on a brand-new domain selling designer goods at 90% off.',
      'Pet listings that demand a deposit and "shipping" before you can visit.',
      'Social media ads for gadgets that arrive broken or never ship.',
    ],
    safetyTips: [
      'Check the domain age and reviews before buying from a new store.',
      'Pay by card or trusted payment service, never by wire or gift card.',
      'Be wary of deals far below normal market price.',
      'Avoid stores with no return address or only a contact form.',
    ],
  },
];
