"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CourseDetailsPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);
  const [previewStarted, setPreviewStarted] = useState(false);
  const previewPlayerRef = useRef<HTMLDivElement | null>(null);

  // Load Razorpay script on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };
    document.head.appendChild(script);
    
    return () => {
      // Cleanup if needed (optional, as script can be reused)
    };
  }, []);

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
  const previewLectures =
    course?.lectures?.filter((lecture) => lecture.isPreview && lecture.videoUrl) || [];
  const selectedPreview =
    previewLectures.find((lecture) => lecture._id === selectedPreviewId) ||
    previewLectures[0];

  const handlePreviewSelect = (lectureId: string) => {
    setSelectedPreviewId(lectureId);
    setPreviewStarted(true);
    window.requestAnimationFrame(() => {
      previewPlayerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

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
              course.lectures.map((lecture, index) => {
                const canPreview = Boolean(lecture.isPreview && lecture.videoUrl);
                const isSelected = selectedPreview?._id === lecture._id;
                const rowClassName = `flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-cyan-300 bg-cyan-50/80 dark:border-cyan-800 dark:bg-cyan-950/30"
                    : "border-slate-200 dark:border-slate-800"
                } ${canPreview ? "hover:border-cyan-300 hover:bg-cyan-50/70 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/30" : ""}`;
                const rowContent = (
                  <>
                    <div className="flex items-center gap-3">
                      <PlayCircle className={`h-5 w-5 ${canPreview ? "text-cyan-500" : "text-slate-400"}`} />
                      <div>
                        <p className="font-medium">{lecture.title}</p>
                        <p className="text-sm text-slate-500">Lesson {index + 1}</p>
                      </div>
                    </div>
                    {canPreview ? (
                      <span className="rounded-md border border-cyan-200 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-900 dark:text-cyan-300">
                        {isSelected && previewStarted ? "Playing" : "Preview"}
                      </span>
                    ) : (
                      <Badge>Locked</Badge>
                    )}
                  </>
                );

                return canPreview ? (
                  <button
                    key={lecture._id}
                    type="button"
                    onClick={() => handlePreviewSelect(lecture._id)}
                    className={rowClassName}
                    aria-pressed={isSelected}
                  >
                    {rowContent}
                  </button>
                ) : (
                  <div key={lecture._id} className={rowClassName}>
                    {rowContent}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Lectures will appear after the instructor uploads videos.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24 overflow-hidden">
          <div
            ref={previewPlayerRef}
            className="relative aspect-video overflow-hidden bg-slate-950"
          >
            {selectedPreview?.videoUrl ? (
              <>
                <ReactPlayer
                  key={selectedPreview._id}
                  src={selectedPreview.videoUrl}
                  controls
                  playing={previewStarted}
                  playsInline
                  width="100%"
                  height="100%"
                  onPlay={() => setPreviewStarted(true)}
                />
                {!previewStarted && (
                  <button
                    type="button"
                    onClick={() => handlePreviewSelect(selectedPreview._id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/10 text-white transition-colors hover:bg-black/20"
                    aria-label={`Play preview: ${selectedPreview.title}`}
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 backdrop-blur">
                      <PlayCircle className="h-9 w-9" />
                    </span>
                  </button>
                )}
              </>
            ) : course.thumbnail ? (
              <Image src={course.thumbnail} alt={course.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <PlayCircle className="h-12 w-12 text-slate-400" />
              </div>
            )}
          </div>
          <CardContent className="space-y-4 p-6">
            {selectedPreview?.title && (
              <div>
                <Badge>Free preview</Badge>
                <p className="mt-2 text-sm font-medium">{selectedPreview.title}</p>
              </div>
            )}
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
  );
}
