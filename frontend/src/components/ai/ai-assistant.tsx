"use client";

import React, { FormEvent, useState, useEffect, useRef } from "react";
import { AlertTriangle, BrainCircuit, RefreshCw, Send, Sparkles, X, ChevronDown, ChevronUp, MessageSquare, BookOpen, Layers, Code2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api-error";
import { aiService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

function getFriendlyErrorMessage(raw: string): { title: string; desc: string; isRetryable: boolean } {
  const lower = raw.toLowerCase();
  
  if (lower.includes("quota") || lower.includes("429") || lower.includes("billing") || lower.includes("exceeded")) {
    return {
      title: "API Limit Reached",
      desc: "The AI service quota has been exceeded or rate-limited. Please check back shortly or try again later.",
      isRetryable: true
    };
  }
  
  if (lower.includes("503") || lower.includes("service unavailable") || lower.includes("high demand") || lower.includes("busy")) {
    return {
      title: "Gemini Service Busy",
      desc: "Google Gemini is currently experiencing heavy traffic (503 Service Unavailable). Please click below to retry your request.",
      isRetryable: true
    };
  }

  if (lower.includes("fetch") || lower.includes("network") || lower.includes("connect")) {
    return {
      title: "Network Connection Issue",
      desc: "Could not establish a connection to the AI service. Please check your network and try again.",
      isRetryable: true
    };
  }

  return {
    title: "AI Response Error",
    desc: raw.replace(/^\[GoogleGenerativeAI Error\]:\s*/i, ""),
    isRetryable: true
  };
}

export default function AiAssistant() {
  const { isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [expandedErrors, setExpandedErrors] = useState<Record<number, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, loading, open]);

  if (!isAuthenticated) {
    return null;
  }

  const askWithPrompt = async (promptText: string) => {
    if (!promptText.trim() || loading) return;

    setLoading(true);
    setLastPrompt(promptText);

    try {
      const response = await aiService.askAssistant({ message: promptText });
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
      setMessages((prev) => [...prev, { role: "error", content: raw }]);
      
      const friendly = getFriendlyErrorMessage(raw);
      if (!raw.toLowerCase().includes("quota") && !raw.toLowerCase().includes("503")) {
        toast.error(friendly.title);
      }
    } finally {
      setLoading(false);
    }
  };

  const ask = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setMessage("");
    await askWithPrompt(userMsg);
  };

  const retry = async () => {
    if (!lastPrompt || loading) return;
    
    // Remove the last message if it is an error message
    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].role === "error") {
        return prev.slice(0, -1);
      }
      return prev;
    });
    
    await askWithPrompt(lastPrompt);
  };

  const toggleErrorExpand = (idx: number) => {
    setExpandedErrors((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const clearChat = () => {
    setMessages([]);
    setMessage("");
    setExpandedErrors({});
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 flex w-[min(calc(100vw-2rem),440px)] h-[550px] flex-col overflow-hidden rounded-2xl border border-cyan-200/50 bg-white/95 backdrop-blur-md shadow-[0_24px_70px_-20px_rgba(6,182,212,0.35)] dark:border-cyan-900/50 dark:bg-slate-950/95"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-100/50 bg-gradient-to-r from-slate-900/5 via-cyan-500/5 to-indigo-500/5 px-4 py-3.5 dark:border-cyan-950/50 dark:from-slate-900/80 dark:via-cyan-950/20 dark:to-indigo-950/20">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-white shadow-sm shadow-cyan-500/10 shrink-0">
                  <BrainCircuit className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm leading-none flex items-center gap-1.5">
                    SkillVault AI Assistant
                    <span className="rounded-full border border-cyan-200/60 bg-cyan-50/50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-900/60 dark:bg-slate-900/80 dark:text-cyan-300">
                      Beta
                    </span>
                  </p>
                  <p className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Close AI assistant"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="flex flex-col h-full justify-between py-2 px-1">
                  <div className="flex flex-col items-center justify-center text-center pt-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-white mb-3 shadow-md shadow-cyan-500/10">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Welcome to SkillVault AI</h3>
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed">
                      Ask questions, generate interactive summaries, practice with quizzes, or build customized roadmaps.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-6 pb-2">
                    {[
                      {
                        label: "AI Doubt Solver",
                        desc: "Get instant concept explanations",
                        prompt: "Explain the concept of closures in JavaScript",
                        icon: MessageSquare,
                      },
                      {
                        label: "Smart Summaries",
                        desc: "Summarize key topics fast",
                        prompt: "Summarize the key concepts of React Server Components",
                        icon: BookOpen,
                      },
                      {
                        label: "MCQ Generator",
                        desc: "Practice with custom quizzes",
                        prompt: "Generate a quiz with 5 questions about CSS Flexbox",
                        icon: Layers,
                      },
                      {
                        label: "Career Roadmaps",
                        desc: "Build your learning path",
                        prompt: "Create a detailed learning roadmap to become a Frontend Developer",
                        icon: Code2,
                      },
                    ].map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setMessage(item.prompt);
                          textareaRef.current?.focus();
                        }}
                        className="flex flex-col text-left p-3 rounded-xl border border-slate-200/60 bg-white/50 dark:border-slate-800/60 dark:bg-slate-900/30 hover:border-cyan-500/40 hover:bg-cyan-50/20 dark:hover:border-cyan-500/30 dark:hover:bg-cyan-950/10 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm group"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/10 to-indigo-400/10 text-cyan-600 dark:text-cyan-400 mb-2 group-hover:from-cyan-400/20 group-hover:to-indigo-400/20 transition-all shrink-0">
                          <item.icon className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal mt-0.5 w-full line-clamp-2">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} className="space-y-1">
                  {msg.role === "user" ? (
                    <div className="flex justify-end pl-10">
                      <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2.5 text-white shadow-sm border border-cyan-400/20">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ) : msg.role === "error" ? (
                    (() => {
                      const friendly = getFriendlyErrorMessage(msg.content);
                      const isExpanded = !!expandedErrors[i];
                      return (
                        <div className="flex flex-col gap-2 rounded-xl border border-red-200/50 bg-red-50/40 p-4 text-red-800 dark:border-red-950/40 dark:bg-red-950/15 dark:text-red-300 shadow-sm backdrop-blur-sm">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-red-950 dark:text-red-200 text-xs">{friendly.title}</h4>
                              <p className="mt-1 text-[11px] leading-relaxed text-red-800/80 dark:text-red-300/85">{friendly.desc}</p>
                            </div>
                          </div>
                          
                          <div className="mt-1 flex items-center justify-end gap-3 border-t border-red-100/50 pt-2 dark:border-red-900/20">
                            <button
                              type="button"
                              onClick={() => toggleErrorExpand(i)}
                              className="text-[10px] font-semibold text-red-600/70 hover:text-red-700 dark:text-red-400/70 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
                            >
                              {isExpanded ? (
                                <>Hide details <ChevronUp className="h-3 w-3" /></>
                              ) : (
                                <>Show details <ChevronDown className="h-3 w-3" /></>
                              )}
                            </button>
                            
                            {friendly.isRetryable && (
                              <button
                                type="button"
                                onClick={retry}
                                className="h-7 px-3 rounded-lg text-[10px] font-semibold bg-red-100/80 hover:bg-red-200/85 text-red-900 dark:bg-red-950/60 dark:hover:bg-red-900/60 dark:text-red-200 flex items-center gap-1.5 transition-colors border border-red-200/30 dark:border-red-800/30 shadow-sm"
                              >
                                <RefreshCw className="h-3 w-3" />
                                Retry
                              </button>
                            )}
                          </div>

                          {isExpanded && (
                            <pre className="mt-2 overflow-x-auto rounded-lg border border-red-200/80 bg-red-100/30 p-2.5 text-[9px] font-mono text-red-800 dark:border-red-900/80 dark:bg-red-950/40 dark:text-red-400 max-h-24 whitespace-pre-wrap">
                              {msg.content}
                            </pre>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex items-start gap-2.5 pr-10">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 text-cyan-600 dark:text-cyan-400">
                        <BrainCircuit className="h-4 w-4" />
                      </span>
                      <div className="rounded-2xl rounded-tl-sm bg-slate-100/80 px-4 py-2.5 text-slate-800 dark:bg-slate-900/80 dark:text-slate-100 border border-slate-200/30 dark:border-slate-800/30 shadow-sm">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 text-cyan-600 dark:text-cyan-400">
                    <BrainCircuit className="h-4 w-4 animate-pulse" />
                  </span>
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100/80 px-4 py-3 dark:bg-slate-900/80 border border-slate-200/30 dark:border-slate-800/30 shadow-sm flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:300ms]" />
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1.5">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={ask}
              className="border-t border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-900 dark:bg-slate-950/50"
            >
              <div className="flex items-end gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(e as unknown as FormEvent);
                    }
                  }}
                  placeholder="Ask about a topic… (Enter to send)"
                  className="min-h-10 max-h-32 resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!message.trim() || loading}
                  isLoading={loading}
                  className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white p-0 hover:from-cyan-600 hover:to-indigo-600 flex items-center justify-center shrink-0 border-0 shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setOpen((v) => !v)}
        size="lg"
        aria-label="Open AI assistant"
        className="group relative h-14 overflow-hidden rounded-xl border border-cyan-300/70 bg-[linear-gradient(135deg,#0f172a,#155e75,#4f46e5)] px-5 text-white shadow-[0_18px_50px_-18px_rgba(6,182,212,0.85)] transition-transform hover:scale-[1.03] hover:bg-[linear-gradient(135deg,#111827,#0e7490,#4338ca)] dark:border-cyan-400/30 dark:shadow-[0_18px_50px_-18px_rgba(34,211,238,0.65)]"
      >
        <span className="absolute inset-x-0 top-0 h-px bg-white/50" />
        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
          <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
        </span>
        <span className="text-base font-semibold tracking-normal">AI</span>
      </Button>
    </div>
  );
}
