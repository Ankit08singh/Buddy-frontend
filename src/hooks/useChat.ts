import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import type { ChatMessage } from "@/types";
import toast from "react-hot-toast";

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("buddy_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(
          parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messages.length > 0) {
      localStorage.setItem("buddy_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
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
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        sender: "ai",
        text: "I'm having a bit of trouble connecting at the moment. Could you try again?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearChat = useCallback(async () => {
    try {
      await api.chat.endSession();
      setMessages([]);
      localStorage.removeItem("buddy_chat_messages");
      toast.success("Session ended");
    } catch (err) {
      toast.error("Failed to end session gracefully");
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
}
