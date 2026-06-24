"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  GraduationCap,
  PlusCircle,
  ShieldCheck,
  Users,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { courseService, purchaseService, adminService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/shared/scroll-reveal";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const purchasedCourses = useQuery({
    queryKey: ["purchased-courses"],
    queryFn: () => purchaseService.getPurchasedCourses(),
    enabled: isAuthenticated && user?.role === "student",
  });

  const instructorCourses = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: () => courseService.getInstructorCourses(),
    enabled: isAuthenticated && user?.role === "instructor",
  });

  const instructorAnalytics = useQuery({
    queryKey: ["instructor-analytics"],
    queryFn: () => courseService.getInstructorAnalytics(),
    enabled: isAuthenticated && user?.role === "instructor",
  });

  const adminAnalytics = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminService.getAnalytics(),
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--background)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  const courses = purchasedCourses.data?.purchasedCourses || [];
  const createdCourses = instructorCourses.data?.courses || [];
  const instructorStats = instructorAnalytics.data?.analytics;
  const adminStats = adminAnalytics.data?.analytics;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--background)] py-10 transition-colors duration-300">
      {/* Decorative Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)]" />
        <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                user.role === "instructor"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/50"
                  : user.role === "student"
                  ? "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-900/50"
                  : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50"
              }`}>
                {user.role === "instructor" && <GraduationCap className="h-3.5 w-3.5" />}
                {user.role === "student" && <BookOpenCheck className="h-3.5 w-3.5" />}
                {user.role === "admin" && <ShieldCheck className="h-3.5 w-3.5" />}
                <span className="capitalize">{user.role}</span>
              </span>
              
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--foreground)] md:text-4xl">
                {getGreeting()}, <span className="gradient-text">{user.name}</span> 👋
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Your SkillVault workspace is connected to the production API.
              </p>
            </div>

            {user.role === "instructor" && (
              <Link href="/dashboard/create-course">
                <Button className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 border-0 text-white font-semibold shadow-md shadow-cyan-500/10 h-10 px-5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <PlusCircle className="mr-2 h-4.5 w-4.5" />
                  Create course
                </Button>
              </Link>
            )}
          </div>
        </ScrollReveal>

        {/* ── Student Dashboard ────────────────────────────────────────────── */}
        {user.role === "student" && (
          <div className="space-y-10">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Enrolled courses" value={courses.length} icon={BookOpenCheck} delay={0.05} />
              <StatCard title="Certificates" value="0" icon={GraduationCap} delay={0.1} />
              <StatCard title="AI assistant status" value="Online" icon={BrainCircuit} delay={0.15} />
            </div>

            <ScrollReveal delay={0.2}>
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <div className="border-b border-[var(--border)] bg-gradient-to-r from-slate-900/5 via-cyan-500/5 to-indigo-500/5 px-6 py-4 dark:from-slate-900/80 dark:via-cyan-950/10 dark:to-indigo-950/10">
                  <h2 className="text-base font-bold text-[var(--foreground)]">Continue learning</h2>
                </div>
                <div className="p-6">
                  {courses.length ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {courses.map((course, idx) => (
                        <motion.div
                          key={course._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          whileHover={{ y: -4 }}
                          className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:shadow-md hover:border-cyan-500/30 transition-all duration-300 group"
                        >
                          <div className="min-w-0">
                            <h3 className="font-bold text-[var(--foreground)] group-hover:text-cyan-500 transition-colors line-clamp-1">
                              {course.title}
                            </h3>
                            <p className="mt-2 text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                              {course.subtitle || "Resume your course and sync progress."}
                            </p>
                          </div>
                          <div className="mt-5">
                            <Link href={`/courses/${course._id}/learn`}>
                              <Button className="w-full h-9 text-xs rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 border-0 text-white font-medium shadow-sm transition-transform active:scale-[0.98]">
                                Continue course
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-slate-50/30 dark:bg-slate-900/10 p-10 text-center">
                      <p className="text-sm text-[var(--muted)]">No purchased courses yet. Explore our catalog to start learning!</p>
                      <Link href="/courses" className="mt-5 inline-block">
                        <Button className="h-9 px-5 text-xs rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-600 hover:to-indigo-600 border-0 font-medium">
                          Browse courses
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ── Instructor Dashboard ─────────────────────────────────────────── */}
        {user.role === "instructor" && (
          <div className="space-y-10">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Courses" value={instructorStats?.totalCourses || createdCourses.length} icon={BookOpenCheck} delay={0.05} />
              <StatCard title="Published" value={instructorStats?.publishedCourses || 0} icon={ShieldCheck} delay={0.1} />
              <StatCard title="Students" value={instructorStats?.students || 0} icon={Users} delay={0.15} />
              <StatCard title="Revenue" value={`$${instructorStats?.revenue || 0}`} icon={BarChart3} delay={0.2} />
            </div>

            <ScrollReveal delay={0.25}>
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <div className="border-b border-[var(--border)] bg-gradient-to-r from-slate-900/5 via-cyan-500/5 to-indigo-500/5 px-6 py-4 dark:from-slate-900/80 dark:via-cyan-950/10 dark:to-indigo-950/10">
                  <h2 className="text-base font-bold text-[var(--foreground)]">Your courses</h2>
                </div>
                <div className="p-6">
                  {createdCourses.length ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {createdCourses.map((course, idx) => (
                        <motion.div
                          key={course._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          whileHover={{ y: -4 }}
                          className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm hover:shadow-md hover:border-cyan-500/30 transition-all duration-300 group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-bold text-[var(--foreground)] group-hover:text-cyan-500 transition-colors line-clamp-1 min-w-0 flex-1">
                                {course.title}
                              </h3>
                              <span className={`px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-full border shrink-0 ${
                                course.isPublished 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50"
                              }`}>
                                {course.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-[var(--muted)] flex items-center gap-1.5">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
                              {course.totalLectures || course.lectures?.length || 0} lectures
                            </p>
                          </div>
                          
                          <div className="mt-5">
                            <Link href={`/dashboard/courses/${course._id}/lectures`}>
                              <Button variant="outline" className="w-full h-9 text-xs rounded-xl hover:bg-cyan-50/20 dark:hover:bg-cyan-950/15 hover:text-cyan-500 hover:border-cyan-500/50 transition-colors font-semibold">
                                Manage lectures
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-slate-50/30 dark:bg-slate-900/10 p-10 text-center">
                      <p className="text-sm text-[var(--muted)]">You haven't created any courses yet. Get started now!</p>
                      <Link href="/dashboard/create-course" className="mt-5 inline-block">
                        <Button className="h-9 px-5 text-xs rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-600 hover:to-indigo-600 border-0 font-medium">
                          Create first course
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ── Admin Dashboard ─────────────────────────────────────────────── */}
        {user.role === "admin" && (
          <div className="space-y-10">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Users" value={adminStats?.users || 0} icon={Users} delay={0.05} />
              <StatCard title="Total Courses" value={adminStats?.courses || 0} icon={BookOpenCheck} delay={0.1} />
              <StatCard title="Enrollments" value={adminStats?.purchases || 0} icon={CreditCard} delay={0.15} />
              <StatCard title="Total Revenue" value={`$${adminStats?.revenue || 0}`} icon={BarChart3} delay={0.2} />
            </div>

            <ScrollReveal delay={0.25}>
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Admin Operations</h2>
                <p className="text-xs text-[var(--muted)] mb-5">Access full user role management, payouts, and system configurations.</p>
                <Link href="/dashboard/admin">
                  <Button className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 border-0 text-white font-semibold h-10 px-5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <ShieldCheck className="mr-2 h-4.5 w-4.5" />
                    Open admin console
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/5 hover:border-cyan-500/30 group"
    >
      {/* Decorative gradient top bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{title}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 text-cyan-500 group-hover:from-cyan-500 group-hover:to-indigo-500 group-hover:text-white transition-all duration-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
