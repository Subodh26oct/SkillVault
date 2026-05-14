"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, Bot, RefreshCw, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api-error";
import { aiService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

export default function AiAssistant() {
  const { isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const ask = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.askAssistant({ message: userMsg });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer || "I could not generate an answer.",
        },
      ]);
    } catch (error: unknown) {
      const raw = getErrorMessage(
        error,
        "AI assistant is temporarily unavailable",
      );

      // Friendly quota / rate-limit message
      const isQuota =
        raw.toLowerCase().includes("quota") ||
        raw.toLowerCase().includes("429") ||
        raw.toLowerCase().includes("billing") ||
        raw.toLowerCase().includes("exceeded");

      const friendlyMsg = isQuota
        ? "⚠️ AI quota exceeded. The Google Gemini plan needs a top-up. Please try again later or contact support."
        : raw;

      setMessages((prev) => [...prev, { role: "error", content: friendlyMsg }]);

      if (!isQuota) {
        toast.error(raw);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMessage("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex w-[min(calc(100vw-2rem),400px)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-500" />
              <p className="font-semibold">AI Learning Assistant</p>
              <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                Beta
              </span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  aria-label="Clear chat"
                  title="Clear conversation"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                aria-label="Close AI assistant"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="max-h-72 min-h-[120px] overflow-y-auto p-4 text-sm leading-6">
            {messages.length === 0 && (
              <p className="text-slate-400 dark:text-slate-500">
                Ask a doubt, request a summary, or get help planning your next
                learning step.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {msg.role === "user" ? (
                  <span className="inline-block max-w-[85%] rounded-2xl rounded-br-sm bg-cyan-500 px-3 py-2 text-white">
                    {msg.content}
                  </span>
                ) : msg.role === "error" ? (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ) : (
                  <span className="inline-block max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                    {msg.content}
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </div>
                <span className="text-xs">Thinking…</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={ask}
            className="border-t border-slate-200 p-3 dark:border-slate-800"
          >
            <div className="flex items-end gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(e as unknown as FormEvent);
                  }
                }}
                placeholder="Ask about a topic… (Enter to send)"
                className="min-h-12 max-h-32 resize-none"
                disabled={loading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || loading}
                isLoading={loading}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <Button
        onClick={() => setOpen((v) => !v)}
        size="lg"
        aria-label="Open AI assistant"
        className="shadow-lg"
      >
        <Bot className="mr-2 h-5 w-5" />
        AI
      </Button>
    </div>
  );
}
