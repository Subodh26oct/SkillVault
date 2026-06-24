import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
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
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
