"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileText, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api-error";
import { aiService, courseService, progressService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function LearnPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const courseQuery = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: () => courseService.getCourseById(params.courseId),
    enabled: isAuthenticated,
  });

  const progressQuery = useQuery({
    queryKey: ["progress", params.courseId],
    queryFn: () => progressService.getProgress(params.courseId),
    enabled: isAuthenticated,
  });

  const course = courseQuery.data?.course;
  const lectures = useMemo(() => course?.lectures || [], [course?.lectures]);
  const activeLecture = lectures.find((lecture) => lecture._id === activeLectureId) || lectures[0];

  const markComplete = async () => {
    if (!activeLecture?._id) {
      return;
    }
    try {
      await progressService.updateLectureProgress(params.courseId, activeLecture._id, {
        isCompleted: true,
      });
      toast.success("Progress synced");
      progressQuery.refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not sync progress"));
    }
  };

  const generateNotes = async () => {
    if (!aiInput.trim() && !activeLecture?.description) {
      toast.error("Add lesson content or notes first");
      return;
    }
    setAiLoading(true);
    try {
      const response = await aiService.generateNotes({
        content: aiInput || activeLecture?.description || course?.description || "",
        format: "notes",
      });
      setAiOutput(response.notes || "");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "AI notes unavailable"));
    } finally {
      setAiLoading(false);
    }
  };

  const generateQuiz = async () => {
    setAiLoading(true);
    try {
      const response = await aiService.generateQuiz({
        topic: activeLecture?.title || course?.title || "Course",
        lectureContent: aiInput || activeLecture?.description || course?.description,
        questionCount: 5,
      });
      setAiOutput(JSON.stringify(response.quiz, null, 2));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "AI quiz unavailable"));
    } finally {
      setAiLoading(false);
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
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-black dark:border-slate-800">
          {activeLecture?.videoUrl ? (
            <ReactPlayer
              src={activeLecture.videoUrl}
              controls
              width="100%"
              height="520px"
              playbackRate={1}
            />
          ) : (
            <div className="flex h-[360px] items-center justify-center text-white">
              Select a lecture after videos are uploaded.
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-normal">{activeLecture?.title || course.title}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {activeLecture?.description || course.description}
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>AI study tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={aiInput}
              onChange={(event) => setAiInput(event.target.value)}
              placeholder="Paste lecture transcript or your rough notes..."
            />
            <div className="flex flex-wrap gap-3">
              <Button onClick={generateNotes} isLoading={aiLoading}>
                <FileText className="mr-2 h-4 w-4" />
                Generate notes
              </Button>
              <Button variant="outline" onClick={generateQuiz} isLoading={aiLoading}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Generate quiz
              </Button>
            </div>
            {aiOutput && (
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-900">
                {aiOutput}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-2 rounded-full bg-cyan-500"
                style={{ width: `${progressQuery.data?.progress?.completionPercentage || 0}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {progressQuery.data?.progress?.completionPercentage || 0}% complete
            </p>
            <Button onClick={markComplete} className="mt-4 w-full">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark lecture complete
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lectures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lectures.map((lecture, index) => (
              <button
                key={lecture._id}
                onClick={() => setActiveLectureId(lecture._id)}
                className="w-full rounded-md border border-slate-200 p-3 text-left text-sm transition hover:border-cyan-400 dark:border-slate-800"
              >
                <span className="text-xs text-slate-500">Lesson {index + 1}</span>
                <span className="mt-1 block font-medium">{lecture.title}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
