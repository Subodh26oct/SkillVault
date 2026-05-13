import api from "@/lib/axios";
import type {
  AdminAnalytics,
  Course,
  CourseProgress,
  InstructorAnalytics,
  User,
} from "@/types";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  course?: Course;
  courses?: Course[];
  lectures?: Course["lectures"];
  purchasedCourses?: Course[];
  progress?: CourseProgress;
  analytics?: T;
  answer?: string;
  notes?: string;
  quiz?: unknown;
  roadmap?: unknown;
  url?: string;
  order?: unknown;
  purchaseId?: string;
  isPurchased?: boolean;
}

export const authService = {
  signup: async (data: {
    name: string;
    email: string;
    password: string;
    role?: "student" | "instructor";
  }) => (await api.post<ApiResponse<never>>("/user/signup", data)).data,

  signin: async (data: { email: string; password: string }) =>
    (await api.post<ApiResponse<never>>("/user/signin", data)).data,

  logout: async () => (await api.post<ApiResponse<never>>("/user/signout")).data,

  getProfile: async () =>
    (await api.get<ApiResponse<never>>("/user/profile")).data,

  updateProfile: async (data: FormData | { name?: string; bio?: string }) =>
    (await api.patch<ApiResponse<never>>("/user/profile", data)).data,

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => (await api.patch<ApiResponse<never>>("/user/change-password", data)).data,

  forgotPassword: async (email: string) =>
    (await api.post<ApiResponse<never>>("/user/forgot-password", { email })).data,

  resetPassword: async (
    token: string,
    data: { password: string; confirmPassword?: string },
  ) =>
    (await api.post<ApiResponse<never>>(`/user/reset-password/${token}`, data))
      .data,

  refreshToken: async () =>
    (await api.post<ApiResponse<never>>("/user/refresh-token")).data,
};

export const courseService = {
  getPublishedCourses: async (params?: {
    query?: string;
    categories?: string;
    sortByPrice?: "low" | "high";
  }) =>
    (await api.get<ApiResponse<never>>("/course/published", { params })).data,

  searchCourses: async (query: string) =>
    (
      await api.get<ApiResponse<never>>("/course/search", {
        params: { query },
      })
    ).data,

  getInstructorCourses: async () =>
    (await api.get<ApiResponse<never>>("/course")).data,

  getCourseById: async (id: string) =>
    (await api.get<ApiResponse<never>>(`/course/c/${id}`)).data,

  createCourse: async (data: FormData) =>
    (await api.post<ApiResponse<never>>("/course", data)).data,

  updateCourse: async (id: string, data: FormData | Partial<Course>) =>
    (await api.patch<ApiResponse<never>>(`/course/c/${id}`, data)).data,

  deleteCourse: async (id: string) =>
    (await api.delete<ApiResponse<never>>(`/course/c/${id}`)).data,

  getLectures: async (courseId: string) =>
    (await api.get<ApiResponse<never>>(`/course/c/${courseId}/lectures`)).data,

  uploadLecture: async (courseId: string, data: FormData) =>
    (await api.post<ApiResponse<never>>(`/course/c/${courseId}/lectures`, data))
      .data,

  deleteLecture: async (courseId: string, lectureId: string) =>
    (
      await api.delete<ApiResponse<never>>(
        `/course/c/${courseId}/lectures/${lectureId}`,
      )
    ).data,

  getInstructorAnalytics: async () =>
    (
      await api.get<ApiResponse<InstructorAnalytics>>(
        "/course/instructor/analytics",
      )
    ).data,
};

export const purchaseService = {
  createStripeCheckout: async (courseId: string) =>
    (
      await api.post<ApiResponse<never>>(
        "/purchase/checkout/create-checkout-session",
        { courseId },
      )
    ).data,

  getPurchasedCourses: async () =>
    (await api.get<ApiResponse<never>>("/purchase")).data,

  getCoursePurchaseStatus: async (courseId: string) =>
    (
      await api.get<ApiResponse<never>>(
        `/purchase/course/${courseId}/detail-with-status`,
      )
    ).data,
};

export const progressService = {
  getProgress: async (courseId: string) =>
    (await api.get<ApiResponse<never>>(`/progress/${courseId}`)).data,

  updateLectureProgress: async (
    courseId: string,
    lectureId: string,
    data: { isCompleted?: boolean; watchTime?: number },
  ) =>
    (
      await api.patch<ApiResponse<never>>(
        `/progress/${courseId}/lectures/${lectureId}`,
        data,
      )
    ).data,

  markCourseComplete: async (courseId: string) =>
    (await api.patch<ApiResponse<never>>(`/progress/${courseId}/complete`)).data,

  resetProgress: async (courseId: string) =>
    (await api.patch<ApiResponse<never>>(`/progress/${courseId}/reset`)).data,
};

export const razorpayService = {
  createOrder: async (courseId: string) =>
    (await api.post<ApiResponse<never>>("/razorpay/create-order", { courseId }))
      .data,

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    purchaseId: string;
    courseId: string;
  }) =>
    (await api.post<ApiResponse<never>>("/razorpay/verify-payment", data)).data,
};

export const aiService = {
  askAssistant: async (data: {
    message: string;
    context?: string;
    courseId?: string;
  }) => (await api.post<ApiResponse<never>>("/ai/assistant", data)).data,

  generateQuiz: async (data: {
    topic: string;
    lectureContent?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
    questionCount?: number;
  }) => (await api.post<ApiResponse<never>>("/ai/quiz", data)).data,

  generateNotes: async (data: {
    content: string;
    format?: "summary" | "notes" | "flashcards";
  }) => (await api.post<ApiResponse<never>>("/ai/notes", data)).data,

  generateRoadmap: async (data: {
    goal: string;
    currentLevel?: "beginner" | "intermediate" | "advanced";
    weeklyHours?: number;
    focusAreas?: string[];
  }) => (await api.post<ApiResponse<never>>("/ai/roadmap", data)).data,
};

export const adminService = {
  getAnalytics: async () =>
    (await api.get<ApiResponse<AdminAnalytics>>("/admin/analytics")).data,

  getUsers: async () =>
    (await api.get<ApiResponse<never> & { users: User[] }>("/admin/users")).data,

  getCourses: async () =>
    (await api.get<ApiResponse<never>>("/admin/courses")).data,

  getPayments: async () =>
    (await api.get<ApiResponse<never> & { payments: unknown[] }>("/admin/payments"))
      .data,

  updateUserRole: async (userId: string, role: User["role"]) =>
    (await api.patch<ApiResponse<never>>(`/admin/users/${userId}/role`, { role }))
      .data,
};
