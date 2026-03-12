import React, { useState, useCallback, useEffect, useRef } from "react";
import Head from "next/head";
import { Sun, Moon, LogOut, Send, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { BuddyAvatar, Avatar } from "@/components/ui";
import type { ChatMessage } from "@/types";
import toast from "react-hot-toast";

interface ChatPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function ChatContent({ darkMode, onToggleDarkMode }: ChatPageProps) {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("buddy_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(
          parsed.map((m: ChatMessage) => ({ ...m, timestamp: new Date(m.timestamp) }))
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("buddy_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await api.chat.sendMessage(text);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: "ai",
        text: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      toast.error("Couldn't send message. Try again.");
      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: "ai",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndSession = async () => {
    try {
      await api.chat.endSession();
      setMessages([]);
      localStorage.removeItem("buddy_chat_messages");
      toast.success("Session ended");
    } catch {
      toast.error("Failed to end session");
    }
  };

  return (
    <>
      <Head>
        <title>Chat — Buddy</title>
      </Head>

      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 flex items-center gap-3 z-10">
          <BuddyAvatar size="md" />
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold text-slate-900 dark:text-white leading-tight">Buddy</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Your supportive workplace companion</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <button
              onClick={() => { logout(); }}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
            <Avatar name={user?.name || "User"} size="sm" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center px-8 py-10">
                  <BuddyAvatar size="lg" className="mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                    Hey {user?.name?.split(" ")[0] || "there"}! 👋
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
                    I&apos;m Buddy, your supportive workplace companion. How are you feeling today?
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["How can I manage stress?", "I need someone to talk to", "Tips for work-life balance"].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.sender === "ai" ? (
                  <BuddyAvatar size="sm" className="flex-shrink-0 mt-1" />
                ) : (
                  <Avatar name={user?.name || "User"} size="sm" className="flex-shrink-0 mt-1" />
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-indigo-500 text-white rounded-br-md"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <BuddyAvatar size="sm" className="flex-shrink-0 mt-1" />
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-2 rounded-lg bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Buddy uses AI and may make mistakes.
              </p>
              {messages.length > 0 && (
                <button
                  onClick={handleEndSession}
                  className="text-xs text-slate-400 hover:text-red-500 transition"
                >
                  End session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ChatPage(props: ChatPageProps) {
  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <ChatContent {...props} />
    </ProtectedRoute>
  );
}

