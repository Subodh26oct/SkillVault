"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api-error";
import { courseService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await courseService.createCourse(formData);
      toast.success("Course created");
      router.push(`/dashboard/courses/${response.course?._id}/lectures`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not create course"));
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "instructor" && user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Only instructors can create courses.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Create course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <Input name="title" required minLength={5} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Subtitle</label>
              <Input name="subtitle" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <Textarea name="description" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">Category</label>
                <Input name="category" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Level</label>
                <select name="level" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Price</label>
                <Input name="price" type="number" min="0" step="0.01" required />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Thumbnail</label>
              <Input name="thumbnail" type="file" accept="image/*" required />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input name="isPublished" type="checkbox" value="true" />
              Publish immediately
            </label>
            <Button type="submit" isLoading={loading}>
              Create course
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
