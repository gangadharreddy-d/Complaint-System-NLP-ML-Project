const classifyEmotion = (text) => {
  const textLower = text.toLowerCase();

  // Specific Payment Check as requested
  const paymentKeywords = [
    "payment",
    "pay",
    "bill",
    "money",
    "transaction",
    "refund",
    "charge",
    "card",
    "checkout",
  ];
  if (paymentKeywords.some((word) => textLower.includes(word))) {
    return "Critical";
  }

  const keywords = {
    Angry: [
      "angry",
      "mad",
      "furious",
      "outraged",
      "annoyed",
      "hate",
      "terrible",
      "worst",
      "awful",
      "stupid",
      "garbage",
      "broken",
    ],
    Frustrated: [
      "frustrated",
      "annoying",
      "stuck",
      "difficult",
      "hard",
      "tired",
      "slow",
      "delayed",
      "wait",
      "fix",
      "help",
      "unable",
    ],
    Sad: [
      "sad",
      "disappointed",
      "unhappy",
      "sorry",
      "regret",
      "bad",
      "poor",
      "unfortunate",
    ],
    Happy: [
      "happy",
      "great",
      "excellent",
      "wonderful",
      "good",
      "thanks",
      "thank you",
      "love",
      "perfect",
      "awesome",
    ],
  };

  for (const [emotion, words] of Object.entries(keywords)) {
    if (words.some((word) => textLower.includes(word))) {
      return emotion;
    }
  }

  return "Neutral";
};

module.exports = { classifyEmotion };
