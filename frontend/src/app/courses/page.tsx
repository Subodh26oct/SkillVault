"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import CourseCard from "@/components/course/course-card";
import { Input } from "@/components/ui/input";
import { courseService } from "@/services/api.service";

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const coursesQuery = useQuery({
    queryKey: ["published-courses", query],
    queryFn: () =>
      query.trim()
        ? courseService.searchCourses(query.trim())
        : courseService.getPublishedCourses(),
  });

  const courses = useMemo(
    () => coursesQuery.data?.courses || [],
    [coursesQuery.data?.courses],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-normal">Explore courses</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Discover published SkillVault courses connected directly to the Express API.
        </p>
      </div>

      <div className="relative mb-8 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search courses, categories, or skills"
          className="pl-10"
        />
      </div>

      {coursesQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-900" />
          ))}
        </div>
      ) : courses.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="font-medium">No courses found</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Try a different search or publish a course from the instructor dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
