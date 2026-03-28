"use client";

import { useEffect, useState } from "react";
import API from "../../utils/api";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Minus, Zap, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    name: "",
    email: "",
    category: "",
    complaintText: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCSV, setIsUploadingCSV] = useState(false);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get("/complaints");
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await API.post("/complaints", newComplaint);
      setComplaints([data, ...complaints]); // Add new complaint to UI

      setNewComplaint({ name: "", email: "", category: "", complaintText: "" });
      if (data.emotion === "Critical") {
        alert(
          "WARNING: A critical payment issue has been detected and escalated!",
        );
      } else {
        alert("Request submitted successfully. The AI has responded.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingCSV(true);
    try {
      const { data } = await API.post("/complaints/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(data.message);
      fetchComplaints();
    } catch (err) {
      console.error("CSV Upload failed", err);
      alert("Failed to upload CSV. Ensure the format is correct.");
    } finally {
      setIsUploadingCSV(false);
      e.target.value = ""; // Reset input
    }
  };

  // Live computed stats
  const total = complaints.length;
  const critical = complaints.filter((c) => {
    const e = (c.emotion || "").toLowerCase();
    return e.includes("ang") || e.includes("frustrat");
  }).length;

  const emotionCounts = {};
  complaints.forEach((c) => {
    const e = c.emotion || "Neutral";
    emotionCounts[e] = (emotionCounts[e] || 0) + 1;
  });
  let topEmotion = "-";
  let maxCount = 0;
  Object.entries(emotionCounts).forEach(([e, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topEmotion = e;
    }
  });

  let sentimentScore = 0;
  complaints.forEach((c) => {
    const e = (c.emotion || "").toLowerCase();
    if (e.includes("happ") || e.includes("positiv")) sentimentScore += 1;
    else if (e.includes("neut")) sentimentScore += 0;
    else sentimentScore -= 1;
  });
  const avgScore = total > 0 ? sentimentScore / total : 0;

  let avgSentiment = "-";
  let sentimentTrend = "Stable";
  let SentimentIcon = Minus;
  let sentimentColor = "text-gray-500";

  if (total > 0) {
    if (avgScore > 0.2) {
      avgSentiment = "Positive";
      sentimentTrend = "Improving";
      SentimentIcon = ArrowUp;
      sentimentColor = "text-emerald-500";
    } else if (avgScore < -0.2) {
      avgSentiment = "Negative";
      sentimentTrend = "Needs Attention";
      SentimentIcon = Minus;
      sentimentColor = "text-red-500";
    } else {
      avgSentiment = "Neutral";
    }
  }

  const getPriority = (emotion) => {
    const e = (emotion || "").toLowerCase();
    if (e.includes("ang") || e.includes("critical")) return "CRITICAL";
    if (e.includes("frustrat") || e.includes("high")) return "HIGH";
    if (e.includes("sad") || e.includes("medium")) return "MEDIUM";
    return "LOW"; // Neutral, Happy
  };

  const triageComplaints = {
    CRITICAL: complaints.filter((c) => getPriority(c.emotion) === "CRITICAL"),
    HIGH: complaints.filter((c) => getPriority(c.emotion) === "HIGH"),
    MEDIUM: complaints.filter((c) => getPriority(c.emotion) === "MEDIUM"),
    LOW: complaints.filter((c) => getPriority(c.emotion) === "LOW"),
  };

  return (
    <DashboardLayout>
      {/* Header section matching screenshot */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Overview
        </h1>
        <p className="text-gray-400">
          Real-time complaint triage and emotion analysis
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Total Complaints */}
        <Card className="bg-[#1a1c29] border-white/5 shadow-lg relative overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Complaints
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-4xl font-bold text-white tracking-tight mb-2">
              {total}
            </div>
            <div className="flex items-center text-gray-500 text-xs font-medium">
              <Minus className="w-3 h-3 mr-1" />
              Live count
            </div>
          </CardContent>
        </Card>

        {/* Critical Issues */}
        <Card className="bg-[#1a1c29] border-white/5 shadow-lg relative overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-medium text-gray-400">
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-4xl font-bold text-red-500 tracking-tight mb-2">
              {critical}
            </div>
            <div
              className={
                "flex items-center " +
                (critical > 0 ? "text-red-500/80" : "text-emerald-500") +
                " text-xs font-medium"
              }
            >
              {critical > 0 ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <Minus className="w-3 h-3 mr-1" />
              )}
              {critical > 0 ? "Requires Attention" : "All Clear"}
            </div>
          </CardContent>
        </Card>

        {/* Avg Sentiment */}
        <Card className="bg-[#1a1c29] border-white/5 shadow-lg relative overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div
              className={`text-4xl font-bold ${avgSentiment !== "-" ? "text-white" : "text-gray-500"} tracking-tight mb-2`}
            >
              {avgSentiment}
            </div>
            <div
              className={`flex items-center ${sentimentColor} text-xs font-medium`}
            >
              <SentimentIcon className="w-3 h-3 mr-1" />
              {sentimentTrend}
            </div>
          </CardContent>
        </Card>

        {/* Top Emotion */}
        <Card className="bg-[#1a1c29] border-white/5 shadow-lg relative overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-medium text-gray-400">
              Top Emotion
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div
              className={`text-4xl font-bold ${topEmotion !== "-" ? "text-[#8b5cf6]" : "text-gray-500"} tracking-tight mb-2`}
            >
              {topEmotion}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit a Request */}
      <div className="mb-12">
        <div className="bg-[#1a1c29] rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col shadow-xl">
          <div className="flex flex-col mb-6">
            <div className="flex items-center space-x-2 text-white mb-2">
              <Zap className="w-6 h-6 text-[#8b5cf6]" />
              <h2 className="text-2xl font-semibold tracking-tight">
                Submit a Request
              </h2>
            </div>
            <p className="text-gray-400 font-medium text-sm">
              Our AI will analyze your request and provide an immediate response
              from our knowledge base.
            </p>
          </div>

          <div className="w-full h-px bg-white/5 mb-6"></div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newComplaint.name}
                  onChange={(e) =>
                    setNewComplaint({ ...newComplaint, name: e.target.value })
                  }
                  className="w-full bg-[#131522] border border-white/5 rounded-lg text-white py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50 shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newComplaint.email}
                  onChange={(e) =>
                    setNewComplaint({ ...newComplaint, email: e.target.value })
                  }
                  className="w-full bg-[#131522] border border-white/5 rounded-lg text-white py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50 shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">
                Request Category
              </label>
              <select
                value={newComplaint.category}
                onChange={(e) =>
                  setNewComplaint({ ...newComplaint, category: e.target.value })
                }
                className="w-full md:w-1/3 bg-[#131522] border border-white/5 rounded-lg text-white py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50 appearance-none shadow-sm cursor-pointer"
              >
                <option
                  value=""
                  disabled
                  className="bg-[#1a1c29] text-gray-400"
                >
                  Select a category...
                </option>
                <option value="Delivery" className="bg-[#1a1c29]">
                  Delivery
                </option>
                <option value="Product" className="bg-[#1a1c29]">
                  Product
                </option>
                <option value="Billing" className="bg-[#1a1c29]">
                  Billing
                </option>
                <option value="Accounts" className="bg-[#1a1c29]">
                  Accounts
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">
                Describe your issue in detail
              </label>
              <textarea
                value={newComplaint.complaintText}
                onChange={(e) =>
                  setNewComplaint({
                    ...newComplaint,
                    complaintText: e.target.value,
                  })
                }
                className="w-full bg-[#131522] border border-white/5 rounded-xl text-white p-4 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all min-h-[120px] resize-none shadow-sm text-sm"
                placeholder="I'm frustrated because my order #12345 hasn't arrived..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                disabled={
                  isSubmitting ||
                  isUploadingCSV ||
                  !newComplaint.category ||
                  !newComplaint.complaintText.trim()
                }
                onClick={handleSubmitComplaint}
                className="flex-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.2)] rounded-xl py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>

              <div className="relative flex-1 sm:flex-none">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="csv-upload"
                  disabled={isUploadingCSV || isSubmitting}
                />
                <Button
                  disabled={isUploadingCSV || isSubmitting}
                  onClick={() => document.getElementById("csv-upload").click()}
                  className="w-full h-full bg-[#131522] hover:bg-[#1a1c29] border border-white/10 text-white font-medium rounded-xl py-6 text-base cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all hover:border-[#8b5cf6]/50"
                >
                  <Upload className="w-5 h-5" />
                  {isUploadingCSV ? "Processing CSV..." : "Upload CSV"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-[#131522] rounded-xl p-6 border border-blue-500/20 flex items-start space-x-4 shadow-lg">
          <div className="w-6 h-6 rounded-full border border-blue-500 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-serif text-xs italic font-bold">i</span>
          </div>
          <div>
            <h4 className="text-blue-400 font-bold mb-1 tracking-tight">
              Instant AI Responses
            </h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Upon submission, our RAG (Retrieval-Augmented Generation) pipeline
              scans our company policies and generates a tailored response
              immediately on your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Priority Triage */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 tracking-tight">
          Priority Triage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* CRITICAL */}
          <div className="bg-[#1a1c29] rounded-xl border border-white/5 p-5 relative overflow-hidden flex flex-col h-[400px]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500"></div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-red-500 font-bold tracking-wider text-sm">
                CRITICAL
              </span>
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {triageComplaints.CRITICAL.map((complaint, idx) => (
                <div
                  key={idx}
                  className="bg-[#131522] rounded-lg p-3 border border-red-500/20"
                >
                  <p className="text-xs text-gray-300 line-clamp-2 mb-2">
                    {complaint.complaintText}
                  </p>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-500">
                    <span>{complaint.category}</span>
                    <span className="text-red-400">{complaint.emotion}</span>
                  </div>
                </div>
              ))}
              {triageComplaints.CRITICAL.length === 0 && (
                <p className="text-xs text-gray-500 italic text-center mt-4">
                  No critical issues
                </p>
              )}
            </div>
          </div>

          {/* HIGH */}
          <div className="bg-[#1a1c29] rounded-xl border border-white/5 p-5 relative overflow-hidden flex flex-col h-[400px]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-500"></div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-orange-500 font-bold tracking-wider text-sm">
                HIGH
              </span>
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {triageComplaints.HIGH.map((complaint, idx) => (
                <div
                  key={idx}
                  className="bg-[#131522] rounded-lg p-3 border border-orange-500/20"
                >
                  <p className="text-xs text-gray-300 line-clamp-2 mb-2">
                    {complaint.complaintText}
                  </p>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-500">
                    <span>{complaint.category}</span>
                    <span className="text-orange-400">{complaint.emotion}</span>
                  </div>
                </div>
              ))}
              {triageComplaints.HIGH.length === 0 && (
                <p className="text-xs text-gray-500 italic text-center mt-4">
                  No high issues
                </p>
              )}
            </div>
          </div>

          {/* MEDIUM */}
          <div className="bg-[#1a1c29] rounded-xl border border-white/5 p-5 relative overflow-hidden flex flex-col h-[400px]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500"></div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-yellow-500 font-bold tracking-wider text-sm">
                MEDIUM
              </span>
              <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {triageComplaints.MEDIUM.map((complaint, idx) => (
                <div
                  key={idx}
                  className="bg-[#131522] rounded-lg p-3 border border-yellow-500/20"
                >
                  <p className="text-xs text-gray-300 line-clamp-2 mb-2">
                    {complaint.complaintText}
                  </p>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-500">
                    <span>{complaint.category}</span>
                    <span className="text-yellow-400">{complaint.emotion}</span>
                  </div>
                </div>
              ))}
              {triageComplaints.MEDIUM.length === 0 && (
                <p className="text-xs text-gray-500 italic text-center mt-4">
                  No medium issues
                </p>
              )}
            </div>
          </div>

          {/* LOW */}
          <div className="bg-[#1a1c29] rounded-xl border border-white/5 p-5 relative overflow-hidden flex flex-col h-[400px]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500"></div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-emerald-500 font-bold tracking-wider text-sm">
                LOW
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {triageComplaints.LOW.map((complaint, idx) => (
                <div
                  key={idx}
                  className="bg-[#131522] rounded-lg p-3 border border-emerald-500/20"
                >
                  <p className="text-xs text-gray-300 line-clamp-2 mb-2">
                    {complaint.complaintText}
                  </p>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-500">
                    <span>{complaint.category}</span>
                    <span className="text-emerald-400">
                      {complaint.emotion}
                    </span>
                  </div>
                </div>
              ))}
              {triageComplaints.LOW.length === 0 && (
                <p className="text-xs text-gray-500 italic text-center mt-4">
                  No low issues
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-10"></div>
    </DashboardLayout>
  );
}
