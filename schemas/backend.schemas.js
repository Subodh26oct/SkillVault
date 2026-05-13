import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/\d/, "Password must contain a number");

export const authSchemas = {
  signup: z.object({
    body: z.object({
      name: z.string().trim().min(2).max(50),
      email: z.string().trim().email().toLowerCase(),
      password,
      role: z.enum(["student", "instructor"]).optional(),
    }),
  }),
  signin: z.object({
    body: z.object({
      email: z.string().trim().email().toLowerCase(),
      password: z.string().min(1, "Password is required"),
    }),
  }),
  forgotPassword: z.object({
    body: z.object({
      email: z.string().trim().email().toLowerCase(),
    }),
  }),
  resetPassword: z.object({
    params: z.object({ token: z.string().min(20) }),
    body: z.object({
      password,
      confirmPassword: z.string().optional(),
    }).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
  }),
  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: password,
    }),
  }),
  updateProfile: z.object({
    body: z.object({
      name: z.string().trim().min(2).max(50).optional(),
      bio: z.string().trim().max(200).optional(),
    }),
  }),
};

export const courseSchemas = {
  create: z.object({
    body: z.object({
      title: z.string().trim().min(5).max(100),
      subtitle: z.string().trim().max(200).optional().or(z.literal("")),
      description: z.string().trim().max(4000).optional().or(z.literal("")),
      category: z.string().trim().min(2),
      level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      price: z.coerce.number().min(0),
      isPublished: z.coerce.boolean().optional(),
    }),
  }),
  update: z.object({
    params: z.object({ courseId: objectId }),
    body: z.object({
      title: z.string().trim().min(5).max(100).optional(),
      subtitle: z.string().trim().max(200).optional().or(z.literal("")),
      description: z.string().trim().max(4000).optional().or(z.literal("")),
      category: z.string().trim().min(2).optional(),
      level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      price: z.coerce.number().min(0).optional(),
      isPublished: z.coerce.boolean().optional(),
    }),
  }),
  courseId: z.object({
    params: z.object({ courseId: objectId }),
  }),
  lecture: z.object({
    params: z.object({ courseId: objectId }),
    body: z.object({
      title: z.string().trim().min(3).max(100),
      description: z.string().trim().max(500).optional().or(z.literal("")),
      duration: z.coerce.number().min(0).optional(),
      isPreview: z.coerce.boolean().optional(),
    }),
  }),
  lectureId: z.object({
    params: z.object({
      courseId: objectId,
      lectureId: objectId,
    }),
  }),
};

export const paymentSchemas = {
  courseIdBody: z.object({
    body: z.object({ courseId: objectId }),
  }),
  razorpayVerify: z.object({
    body: z.object({
      razorpay_order_id: z.string().min(1),
      razorpay_payment_id: z.string().min(1),
      razorpay_signature: z.string().min(1),
      purchaseId: objectId,
      courseId: objectId,
    }),
  }),
};

export const progressSchemas = {
  courseId: z.object({
    params: z.object({ courseId: objectId }),
  }),
  updateLecture: z.object({
    params: z.object({
      courseId: objectId,
      lectureId: objectId,
    }),
    body: z.object({
      isCompleted: z.boolean().optional(),
      watchTime: z.number().min(0).optional(),
    }),
  }),
};

export const aiSchemas = {
  assistant: z.object({
    body: z.object({
      message: z.string().trim().min(1).max(4000),
      context: z.string().trim().max(8000).optional(),
      courseId: objectId.optional(),
    }),
  }),
  quiz: z.object({
    body: z.object({
      topic: z.string().trim().min(2).max(200),
      lectureContent: z.string().trim().max(12000).optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
      questionCount: z.coerce.number().int().min(1).max(10).default(5),
    }),
  }),
  notes: z.object({
    body: z.object({
      content: z.string().trim().min(20).max(15000),
      format: z.enum(["summary", "notes", "flashcards"]).default("notes"),
    }),
  }),
  roadmap: z.object({
    body: z.object({
      goal: z.string().trim().min(2).max(200),
      currentLevel: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
      weeklyHours: z.coerce.number().min(1).max(80).default(8),
      focusAreas: z.array(z.string().trim()).default([]),
    }),
  }),
};

export const adminSchemas = {
  userId: z.object({
    params: z.object({ userId: objectId }),
  }),
  updateRole: z.object({
    params: z.object({ userId: objectId }),
    body: z.object({ role: z.enum(["student", "instructor", "admin"]) }),
  }),
};
