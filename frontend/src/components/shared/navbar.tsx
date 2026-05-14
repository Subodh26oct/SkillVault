"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      router.push("/");
    }
  };

  const navLink =
    "text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200";
  const activeLink = "text-sm font-medium text-cyan-500";

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--surface)]/90 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-[var(--surface)]/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-lg transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Skill<span className="gradient-text">Vault</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            className={pathname === "/courses" ? activeLink : navLink}
            href="/courses"
          >
            Courses
          </Link>
          {isAuthenticated && (
            <Link
              className={
                pathname.startsWith("/dashboard") ? activeLink : navLink
              }
              href="/dashboard"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <button
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] transition-all duration-200 hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-2 text-[var(--muted)] hover:text-red-500"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-600 hover:to-indigo-600 border-0"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/courses"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--surface-2)]"
            >
              Courses
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--surface-2)]"
              >
                Dashboard
              </Link>
            )}
            <div className="mt-3 border-t border-[var(--border)] pt-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-0">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
