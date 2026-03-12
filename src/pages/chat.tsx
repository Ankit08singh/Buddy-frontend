import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

interface ChatPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function ChatContent({ darkMode, onToggleDarkMode }: ChatPageProps) {
  const { messages, score, isLoading, sendMessage, clearChat } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [quickAction, setQuickAction] = useState<string | undefined>(undefined);

  // Scroll to bottom when messages or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  return (
    <div className="flex flex-col h-dvh bg-(--background) overflow-hidden">
      <Head>
        <title>Chat with Buddy — Buddy AI</title>
      </Head>

      <ChatHeader 
        darkMode={darkMode} 
        onToggleDarkMode={onToggleDarkMode} 
        onClearChat={clearChat}
        hasMessages={messages.length > 0}
        score={score}
      />

      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        bottomRef={bottomRef}
        onQuickAction={(text) => setQuickAction(text)}
      />

      <ChatInput 
        onSend={sendMessage} 
        isLoading={isLoading} 
        onQuickAction={quickAction}
        onClearQuickAction={() => setQuickAction(undefined)}
      />
    </div>
  );
}

export default function ChatPage(props: ChatPageProps) {
  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <ChatContent {...props} />
    </ProtectedRoute>
  );
}
