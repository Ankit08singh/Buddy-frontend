import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import EmployeeSelector from "@/components/EmployeeSelector";
import AdminDashboard from "@/components/AdminDashboard";

interface AdminPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const NAV_TABS = ["Overview", "Teams", "Employees", "Reports"] as const;

export default function AdminPage({ darkMode, onToggleDarkMode }: AdminPageProps) {
  const [userId, setUserId] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Overview");

  return (
    <>
      <Head>
        <title>Buddy Admin — Wellness Dashboard</title>
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
          <div className="max-w-[1400px] mx-auto px-6 flex items-center h-14 gap-6">
            <Link href="/chat" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✦</span>
              </div>
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white">Sentiment Pro</span>
            </Link>

            <nav className="flex items-center gap-1 ml-4">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-48"
                  placeholder="Search insights..."
                />
              </div>
              <button className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Manager Overview</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Active Employee View
            </p>
            <EmployeeSelector onSelect={setUserId} currentUserId={userId} />
          </div>

          {userId ? (
            <AdminDashboard userId={userId} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-white text-2xl">✦</span>
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                Enter an employee ID to view insights
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                The dashboard will show sentiment trends, emotion distribution, and flight risk analysis.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
