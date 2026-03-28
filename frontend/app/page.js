"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { Zap, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center relative z-10"
          >
            {/* Blob decorations */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight"
            >
              Understand your customers'
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                emotions
              </span>{" "}
              in real-time.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Revolutionize your support with our AI-powered RAG SaaS. Detect
              frustration, anger, and happiness automatically, and let AI
              generate the perfect response.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/signup">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300"
              >
                <Link href="/login">View Demo</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
          >
            <motion.div
              variants={itemVariants}
              className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                AI-Powered Responses
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our built-in RAG pipeline instantly generates accurate, polite
                responses based on your company's knowledge base.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Emotion Detection
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Identify frustrated customers before they churn. Prioritize
                tickets based on emotional intensity and customer mood.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Detailed Analytics
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Gain deep insights into common categories and emotional trends
                across your entire customer base with visual reports.
              </p>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 p-12 bg-blue-600 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to empower your support team?
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                Join hundreds of companies using EmotionAware's AI
                infrastructure to build better customer relationships.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-14 px-10 rounded-2xl text-xl font-bold hover:scale-105 transition-transform duration-300 text-blue-600"
              >
                <Link href="/signup">Start Your Free Trial</Link>
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-700/50 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
              E
            </div>
            <span className="text-lg font-bold text-gray-900">
              EmotionAware AI
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 EmotionAware Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
