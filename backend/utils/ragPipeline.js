const KnowledgeBase = require("../models/KnowledgeBase");

// Retrieve relevant documents from Supabase knowledge_base table
const retrieveRelevantDocuments = async (query) => {
  const queryLower = query.toLowerCase();
  let categoryFilter = null;

  if (/delivery|shipping|arrive|wait/i.test(queryLower)) {
    categoryFilter = "Delivery";
  } else if (/payment|bill|charge|refund/i.test(queryLower)) {
    categoryFilter = "Payment";
  } else if (/product|broken|damaged|quality/i.test(queryLower)) {
    categoryFilter = "Product";
  } else if (/service|support|help|staff/i.test(queryLower)) {
    categoryFilter = "Service";
  }

  try {
    let docs;
    if (categoryFilter) {
      docs = await KnowledgeBase.findByCategory(categoryFilter);
    } else {
      docs = await KnowledgeBase.findAll();
    }
    return docs.slice(0, 3);
  } catch (err) {
    console.error("KnowledgeBase fetch error:", err.message);
    return [];
  }
};

// Advanced Dynamic Template Engine to generate highly unique AI responses locally
const generateAIResponse = async (
  complaintText,
  emotion,
  category,
  contextDocs,
) => {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const openings = {
    Critical: [
      "We have immediately escalated this to our highest priority queue as we recognize the severe disruption your payment issue has caused.",
      "Please accept our sincerest apologies for the critical failure in our billing system. This is being escalated as a priority 1 incident.",
      "We deeply understand your frustration regarding this matter. Ensuring payment security is our top mandate, and we have logged an urgent review.",
    ],
    Angry: [
      "We hear your anger loud and clear, and we sincerely apologize for this completely unacceptable experience.",
      "This falls far below the standard we aim to provide. We heavily appreciate you alerting us to this.",
      "We are genuinely sorry that you are feeling this way and we are stepping in to get this resolved at once.",
    ],
    Frustrated: [
      "We completely understand that this is an incredibly annoying situation and our team is stepping in right away.",
      "We sincerely apologize for the delay, difficulty, and friction you've experienced here.",
      "Thank you for your ongoing patience while our support staff works to untangle this frustrating issue.",
    ],
    Sad: [
      "We are deeply saddened to hear about your experience and we intend to make this right for you.",
      "It is highly disappointing to know we've let you down. We truly value your feedback and patronage.",
      "Thank you for sharing your disappointment with us; please know we are fully here to support you.",
    ],
    Happy: [
      "Thank you so much for the overwhelmingly positive feedback! We are absolutely thrilled.",
      "We are delighted to hear we could provide such a wonderful experience for you!",
      "It is fantastic to receive such kind words. We will keep striving to exceed your expectations.",
    ],
    Neutral: [
      "Thank you very much for reaching out to our customer care team.",
      "We have successfully received your request and our agents are reviewing the files.",
      "Thank you for providing us with this information. Here is our next step.",
    ],
  };

  const actions = {
    Critical: [
      "A senior financial specialist has been directly assigned to audit your transaction logs.",
      "Our top-tier billing resolution team is actively auditing the payment gateway for errors.",
      "We have dispatched an immediate technical review of the transaction flow on your account.",
    ],
    Billing: [
      "Our billing department is cross-referencing your transaction IDs securely.",
      "We are rigorously reviewing your account history for any discrepancies in recent statements.",
      "An internal audit of your recent charges implies we need to issue an adjustment.",
    ],
    Delivery: [
      "We are instantly pinging our logistics partner to procure a real-time GPS update on your package.",
      "A dispatcher is currently contacting the courier service to trace the exact location of your order.",
      "We have escalated an inquiry with our shipping warehouse to expedite your delivery timeline.",
    ],
    Product: [
      "Our quality control division is meticulously investigating the batch specifics for your mentioned item.",
      "A product specialist is currently verifying the technical specs against your reported defect.",
      "We are logging this with our manufacturing partners to ensure the defect is caught in future production.",
    ],
    Accounts: [
      "Our cybersecurity team is double-checking your account credentials to ensure absolute security.",
      "We are running diagnostics on your user profile to verify all synchronization is accurate.",
      "An account specialist is manually refreshing your backend profile configuration.",
    ],
    Service: [
      "A supervisor is currently reviewing your previous interactions to coach our staff accordingly.",
      "We are auditing the support timeline to uncover exactly where the breakdown in service occurred.",
      "Our management team has been flagged to monitor the resolution of this case.",
    ],
  };

  const kbBridges = [
    "Furthermore, aligning with our internal policies,",
    "Upon reviewing our company protocols,",
    "In accordance with our standard operating procedure,",
    "As outlined in our knowledge base,",
  ];

  const closings = [
    "A detailed update will be posted to your dashboard within 2-4 hours.",
    "You can expect a direct follow-up on your registered email address shortly.",
    "Our team will notify you the moment we have a definitive resolution.",
    "Please check back later today for a comprehensive status update.",
    "We are actively monitoring the situation and will update your ticket momentarily.",
  ];

  const openingPhrase = pick(openings[emotion] || openings["Neutral"]);
  const actionPhrase = pick(
    actions[category] || [
      "Our team is investigating the specific details of your request.",
    ],
  );

  let kbPhrase = "";
  if (contextDocs && contextDocs.length > 0) {
    const doc = contextDocs[0];
    kbPhrase = ` ${pick(kbBridges)} specifically regarding ${doc.title.toLowerCase()}, we guarantee that ${doc.content.substring(0, 100).toLowerCase()}...`;
  }

  const idMatch = complaintText.match(/#\d+|[A-Z0-9]{8,}/);
  const identifierSnippet = idMatch
    ? ` Your reference code ${idMatch[0]} has been linked to this case.`
    : "";

  const closingPhrase = pick(closings);

  return `${openingPhrase}${kbPhrase} ${actionPhrase}${identifierSnippet} ${closingPhrase}`;
};

const runRagPipeline = async (complaintText, emotion, category) => {
  const docs = await retrieveRelevantDocuments(complaintText);
  const aiResponse = await generateAIResponse(
    complaintText,
    emotion,
    category,
    docs,
  );
  return aiResponse;
};

module.exports = { runRagPipeline };
