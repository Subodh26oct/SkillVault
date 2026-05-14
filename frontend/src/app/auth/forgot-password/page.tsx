"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { ForgotPasswordInput, ForgotPasswordSchema } from "@/schemas/validation";
import { authService } from "@/services/api.service";

export default function ForgotPasswordPage() {
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    try {
      setResetUrl(null);
      const response = await authService.forgotPassword(values.email);
      if (response.url) {
        setResetUrl(response.url);
        toast.success("Development reset link created");
        return;
      }
      toast.success("Reset link sent");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not send reset link"));
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold tracking-normal">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Enter your email and we will send a secure reset link.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Send reset link
          </Button>
        </form>
        {resetUrl && (
          <Link
            href={resetUrl}
            className="mt-4 block rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-center text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-950"
          >
            Open reset link
          </Link>
        )}
        <Link href="/auth/login" className="mt-6 block text-center text-sm text-cyan-600">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
