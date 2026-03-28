"use client";

import { useState, useEffect } from "react";
import API from "../../utils/api";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await API.get("/complaints");
        setComplaints(data);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getEmotionBadge = (emotion) => {
    const e = (emotion || "").toLowerCase();
    if (e.includes("critical"))
      return (
        <Badge className="bg-red-600 text-white border border-red-500 animate-pulse">
          {emotion}
        </Badge>
      );
    if (e.includes("ang"))
      return (
        <Badge className="bg-red-500/10 text-red-500 border border-red-500/20">
          {emotion}
        </Badge>
      );
    if (e.includes("frustrat"))
      return (
        <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20">
          {emotion}
        </Badge>
      );
    if (e.includes("sad"))
      return (
        <Badge className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
          {emotion}
        </Badge>
      );
    if (e.includes("happ"))
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          {emotion}
        </Badge>
      );
    return (
      <Badge className="bg-gray-500/10 text-gray-400 border border-gray-500/20">
        {emotion || "Neutral"}
      </Badge>
    );
  };

  return (
    <DashboardLayout title="My Complaints">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Complaint History
        </h1>
        <p className="text-gray-400">
          Review your past complaints and the automated AI support actions.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-gray-400 text-center py-10">
            Loading complaints...
          </div>
        ) : complaints.length > 0 ? (
          complaints.map((c, idx) => (
            <motion.div
              key={c._id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-[#1a1c29] border-white/5 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                    <div className="flex-1 space-y-4">
                      {/* User Complaint */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-300">
                              You submitted a request
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#131522] border border-white/5">
                              {c.category}
                            </span>
                            {getEmotionBadge(c.emotion)}
                          </div>
                          <p className="text-white text-sm leading-relaxed">
                            {c.complaintText}
                          </p>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex items-start gap-3 pl-4 md:pl-11 mt-4 relative">
                        {/* Connecting line */}
                        <div className="absolute left-[15px] md:left-[27px] top-[-30px] w-px h-[38px] bg-white/5"></div>

                        <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center shrink-0 border border-[#8b5cf6]/20">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-[#131522] border border-[#8b5cf6]/20 rounded-xl p-4 flex-1 shadow-inner relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#8b5cf6]/50"></div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-[#8b5cf6]">
                              AI Assistant
                            </span>
                            <span className="text-[10px] text-[#8b5cf6]/60 uppercase tracking-wider font-bold">
                              Action Generated
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {c.aiResponse || "No AI response generated yet."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 flex items-center md:items-start pt-2">
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 bg-[#131522] border-white/5 ${c.status === "Resolved" ? "text-emerald-400 border-emerald-500/20" : "text-gray-400"}`}
                      >
                        {c.status || "Pending"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="bg-[#1a1c29] border-white/5 shadow-xl">
            <CardContent className="p-12 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-50" />
              <p className="text-lg font-medium text-gray-400 mb-1">
                No complaints found
              </p>
              <p className="text-sm">
                You haven't submitted any complaints yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
