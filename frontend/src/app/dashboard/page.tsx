"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  GraduationCap,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseService, purchaseService, adminService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const purchasedCourses = useQuery({
    queryKey: ["purchased-courses"],
    queryFn: () => purchaseService.getPurchasedCourses(),
    enabled: isAuthenticated && user?.role === "student",
  });

  const instructorCourses = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: () => courseService.getInstructorCourses(),
    enabled: isAuthenticated && user?.role === "instructor",
  });

  const instructorAnalytics = useQuery({
    queryKey: ["instructor-analytics"],
    queryFn: () => courseService.getInstructorAnalytics(),
    enabled: isAuthenticated && user?.role === "instructor",
  });

  const adminAnalytics = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminService.getAnalytics(),
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  const courses = purchasedCourses.data?.purchasedCourses || [];
  const createdCourses = instructorCourses.data?.courses || [];
  const instructorStats = instructorAnalytics.data?.analytics;
  const adminStats = adminAnalytics.data?.analytics;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge>{user.role}</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-normal">Welcome back, {user.name}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Your SkillVault workspace is connected to the production API.
          </p>
        </div>
        {user.role === "instructor" && (
          <Link href="/dashboard/create-course">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create course
            </Button>
          </Link>
        )}
      </div>

      {user.role === "student" && (
        <div className="space-y-8">
          <div className="grid gap-5 md:grid-cols-3">
            <StatCard title="Enrolled courses" value={courses.length} icon={BookOpenCheck} />
            <StatCard title="Certificates" value="0" icon={GraduationCap} />
            <StatCard title="AI sessions" value="Ready" icon={BrainCircuit} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Continue learning</CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((course) => (
                    <div key={course._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {course.subtitle || "Resume your course and sync progress."}
                      </p>
                      <Link href={`/courses/${course._id}/learn`} className="mt-4 block">
                        <Button variant="outline" className="w-full">Continue</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-300">No purchased courses yet.</p>
                  <Link href="/courses" className="mt-4 inline-block">
                    <Button>Browse courses</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {user.role === "instructor" && (
        <div className="space-y-8">
          <div className="grid gap-5 md:grid-cols-4">
            <StatCard title="Courses" value={instructorStats?.totalCourses || createdCourses.length} icon={BookOpenCheck} />
            <StatCard title="Published" value={instructorStats?.publishedCourses || 0} icon={ShieldCheck} />
            <StatCard title="Students" value={instructorStats?.students || 0} icon={Users} />
            <StatCard title="Revenue" value={`$${instructorStats?.revenue || 0}`} icon={BarChart3} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Your courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {createdCourses.map((course) => (
                  <div key={course._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {course.totalLectures || course.lectures?.length || 0} lectures
                        </p>
                      </div>
                      <Badge>{course.isPublished ? "Published" : "Draft"}</Badge>
                    </div>
                    <Link href={`/dashboard/courses/${course._id}/lectures`} className="mt-4 block">
                      <Button variant="outline" className="w-full">Manage lectures</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {user.role === "admin" && (
        <div className="space-y-8">
          <div className="grid gap-5 md:grid-cols-4">
            <StatCard title="Users" value={adminStats?.users || 0} icon={Users} />
            <StatCard title="Courses" value={adminStats?.courses || 0} icon={BookOpenCheck} />
            <StatCard title="Payments" value={adminStats?.purchases || 0} icon={CreditLike} />
            <StatCard title="Revenue" value={`$${adminStats?.revenue || 0}`} icon={BarChart3} />
          </div>
          <Link href="/dashboard/admin">
            <Button>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Open admin console
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <Icon className="h-6 w-6 text-cyan-500" />
      </CardContent>
    </Card>
  );
}

function CreditLike({ className }: { className?: string }) {
  return <ShieldCheck className={className} />;
}
