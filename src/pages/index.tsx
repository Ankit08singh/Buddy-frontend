import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getUser, saveUser } from "@/lib/storage";
import { generateUserId } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      router.replace("/chat");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const userId = generateUserId(trimmed);
    saveUser({ userId, name: trimmed });
    router.push("/chat");
  };

  return (
    <>
      <Head>
        <title>Buddy</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-white text-3xl font-bold">B</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Buddy</h1>
          <p className="text-sm text-slate-500 mb-8">Your supportive workplace companion</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl text-sm text-center border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              autoFocus
              maxLength={50}
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              Start Chatting
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
