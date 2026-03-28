"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Brain,
  LayoutGrid,
  PieChart,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState({ name: "Admin User", role: "admin" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch (e) {}
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Analytics", href: "/admin", icon: PieChart },
    { name: "Complaints", href: "/complaint", icon: MessageSquare },
  ];

  return (
    <aside className="w-[280px] bg-[#131522] border-r border-white/5 flex-shrink-0 flex flex-col h-screen text-slate-300">
      {/* Logo */}
      <div className="p-6 pb-8">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-[#8b5cf6]">
            EmotiDesk AI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          // Match paths logically since we changed internal paths a bit
          const isActive =
            pathname === item.href ||
            (pathname === "/admin" && item.href === "/admin");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#222533] text-white border border-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-4 ${isActive ? "text-white" : "text-gray-400"}`}
              />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-8">
          <button
            onClick={logout}
            className="flex items-center px-4 py-3.5 w-full rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-white/5 bg-[#131522]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white font-bold text-lg">
            {mounted && user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {mounted ? user.name : "Admin User"}
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
