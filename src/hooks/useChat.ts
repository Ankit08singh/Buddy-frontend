import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import type { ChatMessage, EngagementSummary, ScoreCache } from "@/types";
import toast from "react-hot-toast";

const SCORE_CACHE_KEY = "buddy_score_cache";

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [score, setScore] = useState<EngagementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScoreLoading, setIsScoreLoading] = useState(false);
  const isInitialMount = useRef(true);

  // 1. Initial hydration on mount
  useEffect(() => {
    // Load messages
    try {
      const savedMessages = localStorage.getItem("buddy_chat_messages");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
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

    // Load score cache
    try {
      const savedScore = localStorage.getItem(SCORE_CACHE_KEY);
      if (savedScore) {
        const parsed: ScoreCache = JSON.parse(savedScore);
        setScore(parsed.score);
      }
    } catch (err) {
      console.error("Failed to load score cache:", err);
    }
  }, []);

  // 2. Persistent storage for messages
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messages.length > 0) {
      localStorage.setItem("buddy_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // 3. Fallback Fetch Score
  const fetchScoreFallback = useCallback(async () => {
    if (user?.role !== "employee") return;
    setIsScoreLoading(true);
    try {
      const data = await api.chat.getMyScoreFallback();
      const newScore = data.score;
      setScore(newScore);
      persistScore(newScore);
    } catch (err) {
      console.warn("Fallback score fetch failed. Keeping existing or zero state.");
      if (!score) {
        setScore({
          total_points: 0,
          current_streak: 0,
          total_sessions: 0,
          total_messages: 0,
          daily_chat_seconds: 0,
          daily_chat_cap_seconds: 1800, // 30 min default
          billable_chat_seconds_remaining: 1800
        });
      }
    } finally {
      setIsScoreLoading(false);
    }
  }, [user, score]);

  // Persist helper
  const persistScore = (s: EngagementSummary) => {
    const cache: ScoreCache = {
      score: s,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(SCORE_CACHE_KEY, JSON.stringify(cache));
  };

  // 4. Fetch on load ONLY if no cache exists
  useEffect(() => {
    if (user?.role === "employee" && !score && !isScoreLoading) {
      fetchScoreFallback();
    }
  }, [user, score, isScoreLoading, fetchScoreFallback]);

  // 5. Send Message with Score Sync
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
      
      // Update score from response (Primary Source)
      if (data.score) {
        setScore(data.score);
        persistScore(data.score);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now()}-error`,
        sender: "ai",
        text: "I'm having a bit of trouble connecting at the moment. Could you try again?",
        timestamp: new Date(),
      }]);
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
      fetchScoreFallback(); // Optional: Refresh score on session end
    } catch (err) {
      toast.error("Failed to end session gracefully");
    }
  }, [fetchScoreFallback]);

  return {
    messages,
    score,
    isLoading,
    isScoreLoading,
    sendMessage,
    clearChat,
    refreshScore: fetchScoreFallback
  };
}
