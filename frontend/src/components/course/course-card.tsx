import Image from "next/image";
import Link from "next/link";
import { Clock, GraduationCap, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Course } from "@/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-slate-200 dark:bg-slate-900">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="h-10 w-10 text-slate-400" />
          </div>
        )}
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge>{course.level || "beginner"}</Badge>
          <span className="font-bold">${course.price}</span>
        </div>
        <div>
          <h3 className="line-clamp-2 font-semibold">{course.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
            {course.subtitle || course.description || "Practical lessons with hands-on progress tracking."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <UserRound className="h-3.5 w-3.5" />
            {course.instructor?.name || "Instructor"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.totalLectures || course.lectures?.length || 0} lectures
          </span>
        </div>
        <Link href={`/courses/${course._id}`} className="block">
          <Button className="w-full">View course</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
