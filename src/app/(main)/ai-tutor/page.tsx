// ========================================
// AI Tutor Page
// ========================================

"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import { GameButton } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your Ogbia language tutor. Ask me about any Ogbia word, pronunciation, or cultural context. For example, try asking: \"What does Emù mean?\" or \"Tell me about the Ogbia people.\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm unable to respond right now. Please make sure the GOOGLE_API_KEY is set in your .env.local file.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[768px] mx-auto px-6 pb-24">
      <div className="flex items-center gap-3 mb-6 pt-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <Bot size={24} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-700">AI Tutor</h1>
          <p className="text-sm text-slate-500">
            Ask anything about the Ogbia language
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-6 min-h-[400px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3 text-sm
                ${
                  message.role === "user"
                    ? "bg-green-500 text-white rounded-br-md"
                    : "bg-slate-100 text-slate-700 rounded-bl-md"
                }
              `}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 lg:left-[256px] bg-white border-t-2 p-4">
        <div className="max-w-[768px] mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about Ogbia words, culture..."
            className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 text-sm
              focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
          />
          <GameButton
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="rounded-xl"
          >
            <Send size={18} />
          </GameButton>
        </div>
      </div>
    </div>
  );
}
