"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, CreditCard, PlayCircle, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api-error";
import {
  courseService,
  purchaseService,
  razorpayService,
} from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CourseDetailsPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const courseQuery = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: () => courseService.getCourseById(params.courseId),
  });

  const statusQuery = useQuery({
    queryKey: ["purchase-status", params.courseId],
    queryFn: () => purchaseService.getCoursePurchaseStatus(params.courseId),
    enabled: isAuthenticated,
  });

  const course = courseQuery.data?.course;
  const isPurchased = statusQuery.data?.isPurchased;

  const startStripeCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    try {
      const response = await purchaseService.createStripeCheckout(params.courseId);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Stripe checkout failed"));
    }
  };

  const startRazorpayCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (!window.Razorpay) {
      toast.error("Razorpay script is not loaded");
      return;
    }
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
    if (!razorpayKey) {
      toast.error("Razorpay is not configured. Please contact support.");
      return;
    }
    try {
      const response = await razorpayService.createOrder(params.courseId);
      const order = response.order as { id: string; amount: number; currency: string };
      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "SkillVault",
        description: course?.title,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#06b6d4" },
        handler: async (payment: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await razorpayService.verifyPayment({
              ...payment,
              purchaseId: response.purchaseId || "",
              courseId: params.courseId,
            });
            toast.success("Payment successful! Redirecting…");
            router.push(`/courses/${params.courseId}/learn`);
          } catch (verifyError: unknown) {
            toast.error(getErrorMessage(verifyError, "Payment verification failed"));
          }
        },
        modal: {
          ondismiss: () => toast.info("Payment cancelled"),
        },
      });
      razorpay.open();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Razorpay checkout failed"));
    }
  };

  if (courseQuery.isLoading || !course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <Badge>{course.category}</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-normal">{course.title}</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {course.subtitle || course.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span>Level: {course.level}</span>
            <span>Instructor: {course.instructor?.name || "SkillVault Instructor"}</span>
            <span>{course.lectures?.length || 0} lectures</span>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Curriculum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures?.length ? (
                course.lectures.map((lecture, index) => (
                  <div key={lecture._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-5 w-5 text-cyan-500" />
                      <div>
                        <p className="font-medium">{lecture.title}</p>
                        <p className="text-sm text-slate-500">Lesson {index + 1}</p>
                      </div>
                    </div>
                    {lecture.isPreview && <Badge>Preview</Badge>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">Lectures will appear after the instructor uploads videos.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 overflow-hidden">
            <div className="relative aspect-video bg-slate-200 dark:bg-slate-900">
              {course.thumbnail ? (
                <Image src={course.thumbnail} alt={course.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Course price</span>
                <span className="text-3xl font-bold">${course.price}</span>
              </div>
              {isPurchased ? (
                <Link href={`/courses/${course._id}/learn`}>
                  <Button className="w-full">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Continue learning
                  </Button>
                </Link>
              ) : (
                <div className="grid gap-3">
                  <Button onClick={startStripeCheckout}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay with Stripe
                  </Button>
                  <Button variant="outline" onClick={startRazorpayCheckout}>
                    <WalletCards className="mr-2 h-4 w-4" />
                    Pay with Razorpay
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
