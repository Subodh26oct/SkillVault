"use client";

import React, { FormEvent, useState } from "react";
import { Map, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { aiService } from "@/services/api.service";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/shared/scroll-reveal";

interface WeeklyTask {
  week: number;
  focus: string;
  tasks: string[];
}

interface Roadmap {
  goal: string;
  duration: string;
  weeklyPlan: WeeklyTask[];
  projects: string[];
  milestones: string[];
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const focusAreas = String(formData.get("focusAreas") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const response = await aiService.generateRoadmap({
        goal: String(formData.get("goal") || ""),
        currentLevel: formData.get("currentLevel") as "beginner" | "intermediate" | "advanced",
        weeklyHours: Number(formData.get("weeklyHours") || 8),
        focusAreas,
      });
      
      const parsedRoadmap = response.roadmap as Roadmap;
      setRoadmap(parsedRoadmap);
      setCompletedTasks({}); // Reset checks
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not generate roadmap"));
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--background)] py-10 transition-colors duration-300">
      {/* Decorative Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* ── Left Card: Form ───────────────────────────────────────────── */}
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              <div className="border-b border-[var(--border)] bg-gradient-to-r from-slate-900/5 via-cyan-500/5 to-indigo-500/5 px-6 py-4.5 dark:from-slate-900/80 dark:via-cyan-950/10 dark:to-indigo-950/10">
                <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-white shadow-sm shadow-cyan-500/10">
                    <Map className="h-4.5 w-4.5" />
                  </span>
                  AI Roadmap Generator
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Goal</label>
                    <Input 
                      name="goal" 
                      placeholder="e.g. Become a full-stack developer, java with spring boot" 
                      required 
                      className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--background)] px-3 text-sm focus-visible:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Current level</label>
                    <select 
                      name="currentLevel" 
                      className="h-10 w-full rounded-xl border border-slate-200 bg-[var(--background)] px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Weekly hours</label>
                    <Input 
                      name="weeklyHours" 
                      type="number" 
                      min="1" 
                      max="80" 
                      defaultValue="8" 
                      className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--background)] px-3 text-sm focus-visible:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Focus areas</label>
                    <Input 
                      name="focusAreas" 
                      placeholder="e.g. frontend, backend, spring boot, DSA" 
                      className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--background)] px-3 text-sm focus-visible:ring-cyan-500/20"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    isLoading={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 border-0 text-white font-semibold shadow-md shadow-cyan-500/10 h-10 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate roadmap
                  </Button>
                </form>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Right Card: Generated Plan ─────────────────────────────────── */}
          <ScrollReveal delay={0.15}>
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm min-h-[460px] flex flex-col">
              <div className="border-b border-[var(--border)] bg-gradient-to-r from-slate-900/5 via-cyan-500/5 to-indigo-500/5 px-6 py-4.5 dark:from-slate-900/80 dark:via-cyan-950/10 dark:to-indigo-950/10">
                <h2 className="text-base font-bold text-[var(--foreground)]">Generated Plan</h2>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {roadmap ? (
                    <motion.div
                      key="roadmap-present"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-8"
                    >
                      {/* Summary Section */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">Personalized Learning Roadmap</span>
                          <h3 className="mt-1 text-xl font-extrabold text-[var(--foreground)] leading-tight">{roadmap.goal}</h3>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/50 shrink-0">
                          Duration: {roadmap.duration}
                        </span>
                      </div>

                      {/* Weekly Plan Timeline */}
                      <div className="relative pl-1">
                        {/* Vertical line helper */}
                        <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-slate-100 dark:bg-slate-800" />

                        <div className="space-y-6">
                          {roadmap.weeklyPlan.map((weekPlan, wIdx) => (
                            <motion.div
                              key={weekPlan.week}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: wIdx * 0.05 }}
                              className="relative pl-10 group"
                            >
                              {/* Pulse circle on timeline */}
                              <div className="absolute left-2.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan-500 bg-white dark:bg-slate-950 transition-transform group-hover:scale-110">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                              </div>

                              <div>
                                <h4 className="font-bold text-[var(--foreground)] text-sm flex items-center gap-2">
                                  Week {weekPlan.week}: <span className="text-cyan-500 font-semibold">{weekPlan.focus}</span>
                                </h4>
                                
                                <ul className="mt-3 space-y-2.5">
                                  {weekPlan.tasks.map((task, tIdx) => {
                                    const taskKey = `w-${weekPlan.week}-t-${tIdx}`;
                                    const isChecked = !!completedTasks[taskKey];
                                    return (
                                      <li 
                                        key={tIdx}
                                        onClick={() => toggleTask(taskKey)}
                                        className="flex items-start gap-3 text-xs text-[var(--muted)] cursor-pointer select-none group"
                                      >
                                        <span className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-all ${
                                          isChecked 
                                            ? "bg-emerald-500 border-emerald-500 text-white" 
                                            : "border-slate-300 dark:border-slate-700 bg-transparent text-transparent group-hover:border-cyan-500"
                                        }`}>
                                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        </span>
                                        <span className={`leading-relaxed transition-all ${
                                          isChecked ? "line-through text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-300"
                                        }`}>
                                          {task}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Projects Section */}
                      {roadmap.projects && roadmap.projects.length > 0 && (
                        <div className="border-t border-[var(--border)] pt-6">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            </span>
                            Target Projects to Build
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {roadmap.projects.map((proj, idx) => (
                              <div key={idx} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-slate-50/50 p-3.5 dark:bg-slate-900/10 hover:border-indigo-500/20 transition-all">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
                                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </span>
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal">{proj}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Milestones Section */}
                      {roadmap.milestones && roadmap.milestones.length > 0 && (
                        <div className="border-t border-[var(--border)] pt-6">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                              </svg>
                            </span>
                            Learning Milestones
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {roadmap.milestones.map((ms, idx) => (
                              <div key={idx} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-slate-50/50 p-3.5 dark:bg-slate-900/10 hover:border-emerald-500/20 transition-all">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal">{ms}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="roadmap-empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center text-center py-10 px-4"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 dark:text-cyan-400 mb-4 shadow-inner">
                        <Map className="h-6 w-6" />
                      </span>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Ready to Generate Plan</h3>
                      <p className="mt-2 text-xs text-[var(--muted)] max-w-[280px] leading-relaxed">
                        Specify your learning goal, current technical background, and hours available in the left form to build your timeline.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
