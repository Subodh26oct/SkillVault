export type UserRole = "student" | "instructor" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  enrolledCourses?: Array<{ course: Course | string; enrolledAt?: string }>;
  createdCourses?: string[];
}

export interface Lecture {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: number;
  isPreview?: boolean;
  order?: number;
}

export interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnail?: string;
  instructor?: User;
  lectures?: Lecture[];
  enrolledStudents?: string[];
  isPublished?: boolean;
  totalLectures?: number;
  totalDuration?: number;
}

export interface CourseProgress {
  _id: string;
  completionPercentage: number;
  isCompleted: boolean;
  lectureProgress: Array<{
    lecture: Lecture | string;
    isCompleted: boolean;
    watchTime: number;
    lastWatched: string;
  }>;
}

export interface AdminAnalytics {
  users: number;
  courses: number;
  purchases: number;
  revenue: number;
}

export interface InstructorAnalytics {
  totalCourses: number;
  publishedCourses: number;
  students: number;
  revenue: number;
  purchases: number;
}
