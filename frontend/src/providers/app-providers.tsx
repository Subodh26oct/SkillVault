"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { authService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";
import AiAssistant from "@/components/ai/ai-assistant";

function AuthBootstrap() {
  const { isAuthenticated, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Only attempt profile fetch if the store thinks we're authenticated.
    // This prevents the 401 → logout loop that races with a fresh sign-in.
    if (!isAuthenticated) {
      return;
    }

    let active = true;

    const loadUser = async () => {
      setLoading(true);
      try {
        const response = await authService.getProfile();
        if (active) {
          setUser(response.user || null);
        }
      } catch {
        // Server said we're not authenticated — clear stale state
        if (active) {
          logout();
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  // Only run when authentication status changes, not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return null;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
        <AuthBootstrap />
        {children}
        <AiAssistant />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
