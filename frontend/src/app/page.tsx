"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Code2,
  CreditCard,
  GraduationCap,
  Layers,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/shared/animated-counter";
import ScrollReveal from "@/components/shared/scroll-reveal";
import TypingEffect from "@/components/shared/typing-effect";

/* ── Data ───────────────────────────────────────────────────────────────── */

const features = [
  {
    title: "AI Learning Assistant",
    icon: BrainCircuit,
    text: "Ask doubts, get concept explanations, generate summaries, and receive personalized study tips powered by Gemini 2.5.",
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
  {
    label: "AI Doubt Solver",
    desc: "Get instant answers on any topic",
    icon: MessageSquare,
  },
  {
    label: "Smart Summaries",
    desc: "Turn lectures into concise notes",
    icon: BookOpen,
  },
  {
    label: "MCQ Generator",
    desc: "Practice with auto-generated quizzes",
    icon: Layers,
  },
  {
    label: "Career Roadmaps",
    desc: "Personalized learning paths",
    icon: Code2,
  },
];

const stats = [
  { value: 50, suffix: "+", label: "Courses Built", icon: BookOpen },
  { value: 15, suffix: "+", label: "AI Features", icon: BrainCircuit },
  { value: 2, suffix: "", label: "Payment Gateways", icon: CreditCard },
  { value: 4, suffix: "", label: "User Roles", icon: ShieldCheck },
];

const techStack = [
  { name: "Next.js", color: "#000000" },
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Express", color: "#000000" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Cloudinary", color: "#3448C5" },
  { name: "Stripe", color: "#635BFF" },
  { name: "Razorpay", color: "#0C2451" },
  { name: "Gemini 2.5", color: "#10A37F" },
  { name: "JWT Auth", color: "#D63AFF" },
  { name: "Zustand", color: "#764ABC" },
  { name: "TanStack Query", color: "#FF4154" },
  { name: "Framer Motion", color: "#0055FF" },
  { name: "Tailwind CSS", color: "#06B6D4" },
];

const testimonials = [
  {
    quote:
      "The architecture is production-grade. Clean separation of concerns, proper error handling, and the AI integration is seamlessly woven into the learning flow.",
    name: "Alex Chen",
    role: "Senior Full-Stack Developer",
    rating: 5,
  },
  {
    quote:
      "Dual payment gateways with proper webhook verification — that's the kind of real-world implementation that sets this project apart from typical portfolio pieces.",
    name: "Sarah Mitchell",
    role: "Engineering Manager",
    rating: 5,
  },
  {
    quote:
      "The role-based dashboard system is impressive. Instructor analytics, student progress tracking, and admin controls — all with secure JWT authentication.",
    name: "Priya Sharma",
    role: "Tech Lead",
    rating: 5,
  },
];

const pricing = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    text: "Browse public courses and track basic learning progress.",
    features: [
      "Access to free courses",
      "Basic progress tracking",
      "Community access",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    text: "Full AI tools, premium courses, notes, quizzes, and certificates.",
    features: [
      "Everything in Starter",
      "AI quiz & note generation",
      "Career roadmaps",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Instructor",
    price: "$49",
    period: "/mo",
    text: "Course publishing, revenue analytics, student management, and payouts.",
    features: [
      "Everything in Pro",
      "Course creation tools",
      "Revenue analytics",
      "Student dashboard",
    ],
    highlight: false,
  },
];

const heroWords = ["AI-powered", "intelligent", "personalized", "adaptive"];

/* ── Page ───────────────────────────────────────────────────────────────── */

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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-indigo-950/70" />
        {/* Grid pattern */}
        <div className="absolute inset-0 hero-grid opacity-20" />

        {/* Animated glow orbs */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -25, 20, 0],
            y: [0, 20, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -15, 25, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              AI-Powered Learning Platform
            </motion.div>

            {/* Heading with typing effect */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Learn faster with{" "}
              <TypingEffect
                words={heroWords}
                className="gradient-text"
                typingSpeed={90}
                deletingSpeed={50}
                pauseDuration={2500}
              />{" "}
              <br className="hidden sm:block" />
              education
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
            >
              SkillVault combines expert-led courses with AI study tools, secure
              payments, and instructor dashboards — everything you need to
              accelerate your career.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/courses">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-600 hover:to-indigo-600 border-0 h-12 px-8 text-base font-semibold shadow-xl shadow-cyan-500/30 transition-all duration-200"
                  >
                    Explore courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/auth/signup">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                  >
                    Start for free
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-400"
            >
              {[
                "No credit card required",
                "Free AI assistant included",
                "Cancel anytime",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Scroll
            </span>
            <ChevronDown className="h-5 w-5 text-slate-500 animate-scroll-indicator" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} direction="up">
                <div className="stat-card flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 text-cyan-500">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-extrabold gradient-text md:text-4xl">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={2.5}
                    />
                  </p>
                  <p className="text-sm font-medium text-[var(--muted)]">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-500">
              Platform features
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              Everything you need to{" "}
              <span className="gradient-text">learn & grow</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
              A production-grade LMS built with modern tech — from AI assistants
              to payment gateways.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.12} direction="up">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="feature-card group h-full"
              >
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                >
                  <feature.icon className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  {feature.text}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── AI Section ───────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
          <ScrollReveal direction="left">
            <div className="flex flex-col justify-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-500">
                AI features
              </p>
              <h2 className="text-4xl font-bold tracking-tight">
                Study smarter, not harder — with{" "}
                <span className="gradient-text">AI tools</span>
              </h2>
              <p className="mt-4 leading-7 text-[var(--muted)]">
                Generate quizzes, summarize lectures into markdown notes, create
                flashcards, and get personalized career roadmaps — all inside
                the platform.
              </p>
              <Link href="/auth/signup" className="mt-8 inline-block">
                <motion.div
                  whileHover={{ scale: 1.04, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-0 hover:from-cyan-600 hover:to-indigo-600 shadow-lg shadow-cyan-500/20">
                    Try AI tools free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            {/* AI Demo Mock */}
            <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--background)] p-1 shadow-2xl shadow-cyan-500/5">
              <div className="gradient-border rounded-2xl">
                <div className="rounded-2xl bg-[var(--surface)] p-6">
                  {/* Mock chat header */}
                  <div className="mb-4 flex items-center gap-3 border-b border-[var(--border)] pb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500">
                      <BrainCircuit className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        SkillVault AI Assistant
                      </p>
                      <p className="text-xs text-emerald-500">● Online</p>
                    </div>
                  </div>

                  {/* Mock messages */}
                  <div className="space-y-3">
                    <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2.5 text-sm text-white">
                      Explain the concept of closures in JavaScript
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="mr-auto max-w-[85%] rounded-2xl rounded-bl-md border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)]"
                    >
                      <p className="mb-2 font-medium text-cyan-500">
                        Great question! 🧠
                      </p>
                      <p className="text-[var(--muted)] leading-relaxed">
                        A closure is a function that retains access to variables
                        from its outer scope, even after the outer function has
                        returned. Think of it as a function with a &quot;backpack&quot; of
                        variables...
                      </p>
                    </motion.div>
                  </div>

                  {/* Feature pills */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {aiFeatures.map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 transition-colors hover:border-cyan-500/30"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-400/20">
                          <item.icon className="h-3.5 w-3.5 text-cyan-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {item.label}
                          </p>
                          <p className="truncate text-[10px] text-[var(--muted)]">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-500">
                Tech stack
              </p>
              <h2 className="text-4xl font-bold tracking-tight">
                Built with{" "}
                <span className="gradient-text">modern technologies</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
                A full-stack architecture using industry-standard tools — from
                React and Next.js to AI integrations and payment gateways.
              </p>
            </div>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <ScrollReveal key={tech.name} delay={i * 0.05} direction="up">
                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="tech-badge"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  {tech.name}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-500">
                What developers say
              </p>
              <h2 className="text-4xl font-bold tracking-tight">
                Built for{" "}
                <span className="gradient-text">real-world impact</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.15} direction="up">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="testimonial-card h-full flex flex-col"
                >
                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <blockquote className="mb-6 flex-1 text-sm leading-7 text-[var(--muted)]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-bold text-white">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-[var(--muted)]">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <ScrollReveal>
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-500">
              Pricing
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              Plans for learners and{" "}
              <span className="gradient-text">creators</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {pricing.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.12} direction="up">
              <motion.div
                whileHover={{ y: -8, scale: plan.highlight ? 1.02 : 1.01 }}
                className={`relative h-full rounded-2xl border p-8 transition-all duration-300 ${
                  plan.highlight
                    ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/5 to-indigo-500/5 shadow-xl shadow-cyan-500/10"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="inline-block rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-1 text-xs font-bold text-white shadow-lg"
                    >
                      Most Popular
                    </motion.span>
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {plan.name}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">
                      {plan.price}
                    </span>
                    <span className="text-[var(--muted)]">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {plan.text}
                  </p>
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
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
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
                  </motion.div>
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="mx-4 mb-16 overflow-hidden rounded-3xl sm:mx-6 lg:mx-8">
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 animate-gradient">
          <div className="relative px-8 py-20 text-center">
            <div className="pointer-events-none absolute inset-0 hero-grid opacity-10" />
            <motion.div
              animate={{ x: [0, 20, -10, 0], y: [0, -10, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -top-10 left-1/3 h-40 w-40 rounded-full bg-cyan-500/30 blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -15, 20, 0], y: [0, 12, -8, 0] }}
              transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl"
            />

            <ScrollReveal>
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <GraduationCap className="mx-auto mb-6 h-14 w-14 text-cyan-400" />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                  Ready to unlock your potential?
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
                  Join SkillVault today. Courses, AI tools, payments, and
                  dashboards — wired into one powerful platform.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Link href="/auth/signup">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="h-13 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-0 px-10 text-base font-semibold hover:from-cyan-600 hover:to-indigo-600 shadow-xl shadow-cyan-500/30"
                      >
                        Start learning for free
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-13 border-white/20 text-white hover:bg-white/10 px-10 text-base"
                      >
                        Open dashboard
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
