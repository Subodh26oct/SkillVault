"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { ResetPasswordInput, ResetPasswordSchema } from "@/schemas/validation";
import { authService } from "@/services/api.service";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    try {
      await authService.resetPassword(params.token, values);
      toast.success("Password reset successfully");
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not reset password"));
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold tracking-normal">Choose a new password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <Input type="password" placeholder="********" {...register("password")} />
            {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Confirm password</label>
            <Input type="password" placeholder="********" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
}
