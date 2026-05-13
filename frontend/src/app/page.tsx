import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "AI Learning Assistant",
    icon: BrainCircuit,
    text: "Ask doubts, get concept explanations, generate summaries, and receive personalized study tips powered by GPT-4.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Instructor Cockpit",
    icon: BarChart3,
    text: "Create courses, upload lectures via Cloudinary, monitor revenue analytics, and manage enrolled students.",
    color: "from-indigo-400 to-purple-500",
  },
  {
    title: "Dual Payment Gateway",
    icon: CreditCard,
    text: "Accept payments globally with Stripe and locally with Razorpay. Full webhook verification and purchase tracking.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Role-Based Access",
    icon: ShieldCheck,
    text: "Separate dashboards for students, instructors, and admins. JWT auth with refresh tokens and cookie httpOnly security.",
    color: "from-orange-400 to-amber-500",
  },
];

const aiFeatures = [
  { label: "AI Doubt Solver", desc: "Get instant answers on any topic" },
  { label: "Smart Summaries", desc: "Turn lectures into concise notes" },
  { label: "MCQ Generator", desc: "Practice with auto-generated quizzes" },
  { label: "Career Roadmaps", desc: "Personalized learning paths" },
];

const stats = [
  { value: "10K+", label: "Learners", icon: Users },
  { value: "500+", label: "Courses", icon: BookOpen },
  { value: "98%", label: "Satisfaction", icon: CheckCircle2 },
  { value: "24/7", label: "AI Support", icon: Zap },
];

const pricing = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    text: "Browse public courses and track basic learning progress.",
    features: ["Access to free courses", "Basic progress tracking", "Community access"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    text: "Full AI tools, premium courses, notes, quizzes, and certificates.",
    features: ["Everything in Starter", "AI quiz & note generation", "Career roadmaps", "Priority support"],
    highlight: true,
  },
  {
    name: "Instructor",
    price: "$49",
    period: "/mo",
    text: "Course publishing, revenue analytics, student management, and payouts.",
    features: ["Everything in Pro", "Course creation tools", "Revenue analytics", "Student dashboard"],
    highlight: false,
  },
];

export default function Home() {
  return (
    <div className="bg-[var(--background)]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80"
          alt="Modern learning space"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-indigo-950/70" />
        {/* Grid pattern */}
        <div className="absolute inset-0 hero-grid opacity-20" />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              AI-Powered Learning Platform
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Learn faster with{" "}
              <span className="gradient-text">AI-powered</span>{" "}
              education
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              SkillVault combines expert-led courses with AI study tools, secure payments,
              and instructor dashboards — everything you need to accelerate your career.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-600 hover:to-indigo-600 border-0 h-12 px-8 text-base font-semibold shadow-xl shadow-cyan-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cyan-500/40"
                >
                  Explore courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                >
                  Start for free
                </Button>
              </Link>
            </div>

            {/* Social proof mini */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Free AI assistant included
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 text-cyan-500">
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-sm text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-500">Platform features</p>
          <h2 className="text-4xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">learn & grow</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            A production-grade LMS built with modern tech — from AI assistants to payment gateways.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-hover group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-md`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-6 text-[var(--muted)]">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Section ────────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-500">AI features</p>
            <h2 className="text-4xl font-bold tracking-tight">
              Study smarter, not harder — with{" "}
              <span className="gradient-text">AI tools</span>
            </h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              Generate quizzes, summarize lectures into markdown notes, create flashcards,
              and get personalized career roadmaps — all inside the platform.
            </p>
            <Link href="/auth/signup" className="mt-8 inline-block">
              <Button className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-0 hover:from-cyan-600 hover:to-indigo-600">
                Try AI tools free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {aiFeatures.map((item) => (
              <div
                key={item.label}
                className="card-hover rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-400/20">
                  <Sparkles className="h-4 w-4 text-cyan-500" />
                </div>
                <p className="font-semibold">{item.label}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-500">Pricing</p>
          <h2 className="text-4xl font-bold tracking-tight">
            Plans for learners and{" "}
            <span className="gradient-text">creators</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`card-hover relative rounded-2xl border p-8 transition-all duration-300 ${
                plan.highlight
                  ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/5 to-indigo-500/5 shadow-xl shadow-cyan-500/10"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">{plan.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-[var(--muted)]">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">{plan.text}</p>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block">
                <Button
                  className={`w-full h-11 font-semibold ${
                    plan.highlight
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-0 hover:from-cyan-600 hover:to-indigo-600 shadow-lg shadow-cyan-500/20"
                      : ""
                  }`}
                  variant={plan.highlight ? "primary" : "outline"}
                >
                  Get started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="mx-4 mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 sm:mx-6 lg:mx-8">
        <div className="relative px-8 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 hero-grid opacity-10" />
          <div className="pointer-events-none absolute -top-10 left-1/3 h-40 w-40 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="relative">
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-cyan-400 animate-float" />
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to unlock your potential?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Join SkillVault today. Courses, AI tools, payments, and dashboards — wired into one powerful platform.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-12 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-0 px-8 font-semibold hover:from-cyan-600 hover:to-indigo-600 shadow-xl shadow-cyan-500/30"
                >
                  Start learning for free
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 border-white/20 text-white hover:bg-white/10 px-8"
                >
                  Open dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
