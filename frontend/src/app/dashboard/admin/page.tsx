"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, BookOpenCheck, CreditCard, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService } from "@/services/api.service";
import { useAuthStore } from "@/store/auth.store";

interface AdminPayment {
  _id: string;
  status: string;
  user?: { email?: string };
  course?: { title?: string };
}

export default function AdminConsolePage() {
  const { user } = useAuthStore();
  const analytics = useQuery({
    queryKey: ["admin-console-analytics"],
    queryFn: () => adminService.getAnalytics(),
    enabled: user?.role === "admin",
  });
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminService.getUsers(),
    enabled: user?.role === "admin",
  });
  const courses = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => adminService.getCourses(),
    enabled: user?.role === "admin",
  });
  const payments = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => adminService.getPayments(),
    enabled: user?.role === "admin",
  });

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="p-8 text-center">Admin access required.</CardContent>
        </Card>
      </div>
    );
  }

  const stats = analytics.data?.analytics;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <Badge>Admin</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-normal">Admin console</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <Metric title="Users" value={stats?.users || 0} icon={Users} />
        <Metric title="Courses" value={stats?.courses || 0} icon={BookOpenCheck} />
        <Metric title="Payments" value={stats?.purchases || 0} icon={CreditCard} />
        <Metric title="Revenue" value={`$${stats?.revenue || 0}`} icon={BarChart3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.data?.users?.slice(0, 8).map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.email}</p>
                </div>
                <Badge>{item.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(payments.data?.payments as AdminPayment[] | undefined)?.slice(0, 8).map((payment) => (
              <div key={payment._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <div>
                  <p className="font-medium">{payment.course?.title || "Course"}</p>
                  <p className="text-sm text-slate-500">{payment.user?.email || "Learner"}</p>
                </div>
                <Badge>{payment.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {courses.data?.courses?.slice(0, 10).map((course) => (
            <div key={course._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-medium">{course.title}</p>
              <p className="mt-1 text-sm text-slate-500">{course.instructor?.name || "Instructor"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({
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
