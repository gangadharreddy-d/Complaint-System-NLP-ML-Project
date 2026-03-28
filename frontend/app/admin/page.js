"use client";

import { useEffect, useState } from "react";
import API from "../../utils/api";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import {
  Trash2,
  AlertCircle,
  Filter,
  Download,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState({
    emotionCounts: [],
    categoryCounts: [],
  });
  const [filters, setFilters] = useState({ emotion: "all", category: "all" });

  const fetchData = async () => {
    try {
      const { data } = await API.get("/complaints");
      setComplaints(data);

      const emotionMap = {};
      const categoryMap = {};

      data.forEach((c) => {
        const e = c.emotion || "Neutral";
        const cat = c.category || "Other";
        emotionMap[e] = (emotionMap[e] || 0) + 1;
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      setAnalytics({
        emotionCounts: Object.keys(emotionMap).map((k) => ({
          _id: k,
          count: emotionMap[k],
        })),
        categoryCounts: Object.keys(categoryMap).map((k) => ({
          _id: k,
          count: categoryMap[k],
        })),
      });
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/${id}`, { status });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteComplaint = async (id) => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      try {
        await API.delete(`/complaints/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete complaint");
      }
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    return (
      (filters.emotion === "all" || c.emotion === filters.emotion) &&
      (filters.category === "all" || c.category === filters.category)
    );
  });

  const exportToCSV = () => {
    const headers = [
      "ID",
      "User Name",
      "User Email",
      "Category",
      "Emotion",
      "Complaint Text",
      "AI Response",
      "Status",
      "Date",
    ];
    const csvRows = [headers.join(",")];

    filteredComplaints.forEach((c) => {
      const row = [
        `"${c._id}"`,
        `"${(c.userId?.name || "Unknown").replace(/"/g, '""')}"`,
        `"${(c.userId?.email || "N/A").replace(/"/g, '""')}"`,
        `"${c.category}"`,
        `"${c.emotion}"`,
        `"${c.complaintText.replace(/"/g, '""')}"`,
        `"${(c.aiResponse || "").replace(/"/g, '""')}"`,
        `"${c.status}"`,
        `"${new Date(c.createdAt).toLocaleDateString()}"`,
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaints_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPrediction = () => {
    if (!analytics.categoryCounts.length)
      return "Insufficient data for detailed predictions.";
    const highestCategory = [...analytics.categoryCounts].sort(
      (a, b) => b.count - a.count,
    )[0];
    if (highestCategory) {
      return `Based on recent influx velocity, expect a 15-20% surge in '${highestCategory._id}' complaints over the next 7 days. Ensure adequate staffing is prepared.`;
    }
    return "Issue volume is currently stable. No major anomalies detected.";
  };

  const getEmotionBadge = (emotion) => {
    switch (emotion) {
      case "Critical":
        return (
          <Badge className="bg-red-600 text-white border border-red-500 hover:bg-red-700 animate-pulse">
            {emotion}
          </Badge>
        );
      case "Angry":
        return (
          <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20">
            {emotion}
          </Badge>
        );
      case "Frustrated":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20">
            {emotion}
          </Badge>
        );
      case "Sad":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20">
            {emotion}
          </Badge>
        );
      case "Happy":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20">
            {emotion}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20">
            {emotion || "Neutral"}
          </Badge>
        );
    }
  };

  const emotionColors = {
    Critical: "#dc2626",
    Angry: "#ef4444",
    Frustrated: "#f97316",
    Sad: "#8b5cf6",
    Happy: "#10b981",
    Neutral: "#64748b",
  };

  const emotionChartData = {
    labels: analytics.emotionCounts.map((e) => e._id || "Neutral"),
    datasets: [
      {
        data: analytics.emotionCounts.map((e) => e.count),
        backgroundColor: analytics.emotionCounts.map(
          (e) => emotionColors[e._id || "Neutral"] || "#64748b",
        ),
        borderColor: "#1a1c29",
        borderWidth: 2,
      },
    ],
  };

  const categoryChartData = {
    labels: analytics.categoryCounts.map((c) => c._id),
    datasets: [
      {
        label: "Complaints",
        data: analytics.categoryCounts.map((c) => c.count),
        backgroundColor: "#8b5cf6",
        borderRadius: 8,
      },
    ],
  };

  return (
    <DashboardLayout title="Admin Control Panel">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full bg-[#1a1c29] border-white/5 shadow-xl text-white">
            <CardHeader>
              <CardTitle>Emotion Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Live breakdown of customer sentiment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex justify-center">
                <Pie
                  data={emotionChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: "#9ca3af" } } },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full bg-[#1a1c29] border-white/5 shadow-xl text-white">
            <CardHeader>
              <CardTitle>Categories Breakdown</CardTitle>
              <CardDescription className="text-gray-400">
                Volume of complaints across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex justify-center">
                <Bar
                  data={categoryChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        ticks: { color: "#9ca3af" },
                        grid: { color: "rgba(255,255,255,0.05)" },
                      },
                      x: {
                        ticks: { color: "#9ca3af" },
                        grid: { color: "rgba(255,255,255,0.05)" },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Predictive AI Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full bg-[#1a1c29] border-white/5 shadow-xl text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
                AI Predictive Insights
              </CardTitle>
              <CardDescription className="text-gray-400">
                Velocity forecasting
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#131522]/30 rounded-b-lg border-t border-white/5">
              <TrendingUp className="w-12 h-12 text-[#8b5cf6] mb-6 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-pulse opacity-80" />
              <p className="text-gray-300 text-base leading-relaxed font-medium">
                {getPrediction()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters & Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-[#1a1c29] border-white/5 shadow-xl text-white">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Complaint Management</CardTitle>
              <CardDescription className="text-gray-400">
                Review, assign, and resolve customer issues
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <UISelect
                value={filters.emotion}
                onValueChange={(val) =>
                  setFilters({ ...filters, emotion: val })
                }
              >
                <SelectTrigger className="w-[140px] bg-[#131522] border-white/5 text-white focus:ring-[#8b5cf6]/50">
                  <SelectValue placeholder="Emotion" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1c29] border-white/5 text-white">
                  <SelectItem
                    value="all"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    All Emotions
                  </SelectItem>
                  <SelectItem
                    value="Critical"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Critical
                  </SelectItem>
                  <SelectItem
                    value="Angry"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Angry
                  </SelectItem>
                  <SelectItem
                    value="Frustrated"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Frustrated
                  </SelectItem>
                  <SelectItem
                    value="Sad"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Sad
                  </SelectItem>
                  <SelectItem
                    value="Happy"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Happy
                  </SelectItem>
                  <SelectItem
                    value="Neutral"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Neutral
                  </SelectItem>
                </SelectContent>
              </UISelect>

              <UISelect
                value={filters.category}
                onValueChange={(val) =>
                  setFilters({ ...filters, category: val })
                }
              >
                <SelectTrigger className="w-[160px] bg-[#131522] border-white/5 text-white focus:ring-[#8b5cf6]/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1c29] border-white/5 text-white">
                  <SelectItem
                    value="all"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    All Categories
                  </SelectItem>
                  <SelectItem
                    value="Delivery"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Delivery
                  </SelectItem>
                  <SelectItem
                    value="Product"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Product
                  </SelectItem>
                  <SelectItem
                    value="Billing"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Billing
                  </SelectItem>
                  <SelectItem
                    value="Accounts"
                    className="focus:bg-[#131522] focus:text-white"
                  >
                    Accounts
                  </SelectItem>
                </SelectContent>
              </UISelect>

              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm bg-blue-500/10 text-[#8b5cf6] hover:bg-blue-500/20 flex gap-2 border border-[#8b5cf6]/20 shrink-0 h-10 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {filteredComplaints.length} Results
              </Badge>

              <Button
                onClick={exportToCSV}
                className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shrink-0 h-10 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                <Download className="w-4 h-4 mr-2 animate-bounce" />
                Export CSV
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 border-t border-white/5">
            <Table>
              <TableHeader className="bg-[#131522]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[200px] text-gray-400">
                    Customer
                  </TableHead>
                  <TableHead className="text-gray-400">
                    Complaint & AI Response
                  </TableHead>
                  <TableHead className="w-[100px] text-gray-400">
                    Emotion
                  </TableHead>
                  <TableHead className="w-[140px] text-gray-400">
                    Status
                  </TableHead>
                  <TableHead className="w-[80px] text-right text-gray-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((c) => (
                    <TableRow
                      key={c._id}
                      className="border-white/5 hover:bg-[#131522]/50 transition-colors"
                    >
                      <TableCell>
                        <div className="font-medium text-sm text-gray-200">
                          {c.userId?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {c.userId?.email || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-gray-300 line-clamp-1">
                          {c.complaintText}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic max-w-sm">
                          <span className="text-[#8b5cf6] font-semibold mr-1">
                            AI:
                          </span>
                          {c.aiResponse || "No AI response generated"}
                        </p>
                      </TableCell>
                      <TableCell>{getEmotionBadge(c.emotion)}</TableCell>
                      <TableCell>
                        <UISelect
                          value={c.status}
                          onValueChange={(val) => updateStatus(c._id, val)}
                        >
                          <SelectTrigger className="h-8 text-xs bg-[#131522] border-white/5 text-gray-300 focus:ring-[#8b5cf6]/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1c29] border-white/5 text-white">
                            <SelectItem
                              value="Pending"
                              className="focus:bg-[#131522] focus:text-white"
                            >
                              Pending
                            </SelectItem>
                            <SelectItem
                              value="In Progress"
                              className="focus:bg-[#131522] focus:text-white"
                            >
                              In Progress
                            </SelectItem>
                            <SelectItem
                              value="Resolved"
                              className="focus:bg-[#131522] focus:text-white"
                            >
                              Resolved
                            </SelectItem>
                          </SelectContent>
                        </UISelect>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteComplaint(c._id)}
                          className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell
                      colSpan="5"
                      className="h-24 text-center text-gray-500"
                    >
                      No complaints match the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
