import React, { useState, useCallback, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Settings, Flame } from "lucide-react";
import { sendMessage } from "@/lib/api";
import { getUser } from "@/lib/storage";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import ChatInput from "@/components/ChatInput";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function ChatPage({ darkMode, onToggleDarkMode }: ChatPageProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace("/");
      return;
    }
    setUserId(user.userId);
    setUserName(user.name);

    try {
      const saved = localStorage.getItem("buddy_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(
          parsed.map((m: ChatMessageType) => ({ ...m, timestamp: new Date(m.timestamp) }))
        );
      }
    } catch {}
  }, [router]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("buddy_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: ChatMessageType = {
        id: `msg-${Date.now()}`,
        sender: "user",
        text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const data = await sendMessage(userId, text);
        const aiMsg: ChatMessageType = {
          id: `msg-${Date.now()}-ai`,
          sender: "ai",
          text: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const errMsg: ChatMessageType = {
          id: `msg-${Date.now()}-err`,
          sender: "ai",
          text: "Couldn't send that. Check your connection and try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  return (
    <>
      <Head>
        <title>Buddy</title>
      </Head>

      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-sm font-bold">✦</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold text-slate-900 dark:text-white leading-tight">Buddy</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Your supportive workplace companion</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2.5 py-1 rounded-lg text-xs font-medium">
              <Flame className="w-3.5 h-3.5" />
              <span>5</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-medium">
              120 pts
            </div>
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-[18px] h-[18px]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
            {messages.length > 0 && (
              <div className="flex items-center justify-center mb-6">
                <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400 tracking-widest uppercase">
                  Today
                </span>
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center px-8 py-10">
                  <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl">✦</span>
                  </div>
                  <p className="text-base font-medium text-slate-900 dark:text-white mb-1">
                    Hey {userName || "there"}! 👋
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    I&apos;m Buddy, your supportive workplace companion. How can I help you today?
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} userName={userName} />
            ))}

            <TypingIndicator visible={isLoading} />
            <div ref={bottomRef} />
          </div>
        </div>

        <ChatInput onSend={handleSend} isLoading={isLoading} />

        <div className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/50 py-1.5 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Buddy uses AI and might make mistakes. Check important information.
          </p>
        </div>
      </div>
    </>
  );
}

