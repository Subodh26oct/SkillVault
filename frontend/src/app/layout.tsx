import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import AppProviders from "@/providers/app-providers";

export const metadata: Metadata = {
  title: "SkillVault — AI-Powered Learning Platform",
  description:
    "Production-ready LMS with secure auth, instructor dashboards, AI study tools, Stripe & Razorpay payments, and personalized course tracking.",
  openGraph: {
    title: "SkillVault — AI-Powered Learning Platform",
    description: "Learn smarter with AI-powered tools, expert instructors, and seamless payments.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">SkillVault</span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  © {new Date().getFullYear()} SkillVault. Built with Next.js, Express & AI.
                </p>
              </div>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
