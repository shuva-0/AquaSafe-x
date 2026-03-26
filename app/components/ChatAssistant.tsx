"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { AnalysisResult } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatAssistantProps {
  context?: AnalysisResult | null;
}

export default function ChatAssistant({ context }: ChatAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AquaSafe AI assistant. Ask me about your water quality results, health risks, or what steps to take. 💧",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: context ?? null,
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? "Sorry, I couldn't process that." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600
          flex items-center justify-center shadow-2xl shadow-cyan-500/30 text-white text-xl"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((o) => !o)}
        title="Open AI Assistant"
      >
        {open ? "✕" : "💬"}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[520px] flex flex-col
              bg-[#0e1520] border border-cyan-500/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-[#121826]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-sm">
                💧
              </div>
              <div>
                <div className="text-sm font-bold text-white">AquaSafe Assistant</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-br-sm"
                        : "bg-[#1a2436] text-gray-300 border border-gray-700/50 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-[#1a2436] border border-gray-700/50 rounded-xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                          animate={{ y: [-2, 2, -2] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-800 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about your water quality…"
                className="flex-1 bg-[#0d1421] border border-gray-700 rounded-xl px-3 py-2 text-sm
                  text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500
                  focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              <motion.button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white
                  flex items-center justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                ↑
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}