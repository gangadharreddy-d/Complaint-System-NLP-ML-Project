"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/login");
    } else {
      setUser(storedUser);
    }
  }, [router]);

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f111a] text-white">
        Loading...
      </div>
    );

  return (
    <div className="bg-[#0f111a] flex h-screen overflow-hidden text-white font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <section className="flex-1 p-10 max-w-[1400px]">{children}</section>
      </main>
    </div>
  );
}
