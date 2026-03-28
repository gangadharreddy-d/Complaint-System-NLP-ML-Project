const Complaint = require("../models/Complaint");
const { classifyEmotion } = require("../utils/emotionClassifier");
const { runRagPipeline } = require("../utils/ragPipeline");
const csv = require("csv-parser");
const fs = require("fs");
const { Readable } = require("stream");

exports.createComplaint = async (req, res) => {
  try {
    let { complaintText, category, name, email } = req.body;
    const emotion = classifyEmotion(complaintText);

    // Auto-categorize Payment issues as Critical
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
    if (
      paymentKeywords.some((word) => complaintText.toLowerCase().includes(word))
    ) {
      category = "Critical";
    }

    // Run mock RAG pipeline
    const aiResponse = await runRagPipeline(complaintText, emotion, category);

    const complaint = await Complaint.create({
      userId: req.user.id,
      complaintText,
      category,
      emotion,
      aiResponse,
      status: "Pending",
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query.userId = req.user.id;
    }
    const complaints = await Complaint.find(query);
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, {
      status,
    });
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const emotionCounts = await Complaint.getEmotionCounts();
    const categoryCounts = await Complaint.getCategoryCounts();

    res.status(200).json({ emotionCounts, categoryCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    await Complaint.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Complaint deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const complaints = [];
    const results = [];

    Readable.from(req.file.buffer)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (const row of results) {
            const complaintText =
              row.complaintText || row.Complaint || row.text;
            if (!complaintText) continue;

            let category = row.category || row.Category || "Other";
            const emotion = classifyEmotion(complaintText);

            // Auto-categorize based on keywords if category is generic
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
            if (
              paymentKeywords.some((word) =>
                complaintText.toLowerCase().includes(word),
              )
            ) {
              category = "Critical";
            } else if (category === "Other") {
              if (/delivery|shipping|arrive|wait/i.test(complaintText))
                category = "Delivery";
              else if (/product|broken|damaged|quality/i.test(complaintText))
                category = "Product";
              else if (/service|support|help|staff/i.test(complaintText))
                category = "Service";
              else if (/account|login|password/i.test(complaintText))
                category = "Accounts";
            }

            const aiResponse = await runRagPipeline(
              complaintText,
              emotion,
              category,
            );

            complaints.push({
              userId: req.user.id,
              complaintText,
              category,
              emotion,
              aiResponse,
              status: "Pending",
            });
          }

          const savedComplaints = await Complaint.insertMany(complaints);

          // No temp file to clean up since uploading from memory buffer

          res.status(201).json({
            message: `Successfully processed ${savedComplaints.length} complaints`,
            count: savedComplaints.length,
          });
        } catch (err) {
          console.error("Error processing CSV rows:", err);
          res
            .status(500)
            .json({ message: "Error processing CSV rows", error: err.message });
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
