"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api-error";
import { courseService } from "@/services/api.service";

export default function ManageLecturesPage() {
  const params = useParams<{ courseId: string }>();
  const [loading, setLoading] = useState(false);
  const courseQuery = useQuery({
    queryKey: ["course-manage", params.courseId],
    queryFn: () => courseService.getCourseById(params.courseId),
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      await courseService.uploadLecture(params.courseId, formData);
      toast.success("Lecture uploaded");
      event.currentTarget.reset();
      courseQuery.refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not upload lecture"));
    } finally {
      setLoading(false);
    }
  };

  const deleteLecture = async (lectureId: string) => {
    try {
      await courseService.deleteLecture(params.courseId, lectureId);
      toast.success("Lecture deleted");
      courseQuery.refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not delete lecture"));
    }
  };

  const course = courseQuery.data?.course;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload lecture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <Input name="title" required minLength={3} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <Textarea name="description" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Duration minutes</label>
                <Input name="duration" type="number" min="0" step="0.1" />
              </div>
              <label className="mt-8 flex items-center gap-2 text-sm">
                <input name="isPreview" type="checkbox" value="true" />
                Free preview
              </label>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Video</label>
              <Input name="video" type="file" accept="video/*" required />
            </div>
            <Button type="submit" isLoading={loading}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload lecture
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{course?.title || "Course lectures"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {course?.lectures?.length ? (
            course.lectures.map((lecture, index) => (
              <div key={lecture._id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">Lesson {index + 1}</p>
                  <h3 className="font-semibold">{lecture.title}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteLecture(lecture._id)} aria-label="Delete lecture">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">No lectures uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
