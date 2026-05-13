"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { authService } from "@/services/api.service";
import { SignUpInput, SignUpSchema } from "@/schemas/validation";
import { useAuthStore } from "@/store/auth.store";

export default function SignUp() {
  const router = useRouter();
  const { setAuthState } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "student" },
  });

  const onSubmit = async (values: SignUpInput) => {
    try {
      const response = await authService.signup({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      if (response.user) {
        setAuthState(response.user, response.token);
      }
      toast.success("Account created! Welcome to SkillVault 🎉");
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to create account"));
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-60" />
      <div className="pointer-events-none absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl shadow-indigo-500/5">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-500 shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              Join thousands of learners on SkillVault
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <Input placeholder="Alex Carter" className="pl-10" {...register("name")} />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <Input type="email" placeholder="you@example.com" className="pl-10" {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {(["student", "instructor"] as const).map((role) => (
                  <label
                    key={role}
                    className="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[var(--border)] p-3 transition-all duration-200 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-50 dark:has-[:checked]:bg-cyan-950/30"
                  >
                    <input
                      type="radio"
                      value={role}
                      className="sr-only"
                      {...register("role")}
                    />
                    <GraduationCap className="h-4 w-4 text-[var(--muted)]" />
                    <span className="text-sm font-medium capitalize">
                      {role === "student" ? "Learn" : "Teach"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600 border-0 h-11 font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 mt-2"
              isLoading={isSubmitting}
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-cyan-500 hover:text-cyan-400 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
