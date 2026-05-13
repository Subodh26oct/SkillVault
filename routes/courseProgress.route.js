import express from "express"
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
    getUserCourseProgress,
    updateLectureProgress,
    markCourseAsCompleted,
    resetCourseProgress
} from "../controllers/courseProgress.controller.js";
import { validateRequest } from "../middleware/zod.middleware.js";
import { progressSchemas } from "../schemas/backend.schemas.js";

const router = express.Router();

// Get course progress
router.get("/:courseId", isAuthenticated, validateRequest(progressSchemas.courseId), getUserCourseProgress);

// Update lecture progress
router.patch(
  "/:courseId/lectures/:lectureId",
  isAuthenticated,
  validateRequest(progressSchemas.updateLecture),
  updateLectureProgress
);

// Mark course as completed
router.patch("/:courseId/complete", isAuthenticated, validateRequest(progressSchemas.courseId), markCourseAsCompleted);

// Reset course progress
router.patch("/:courseId/reset", isAuthenticated, validateRequest(progressSchemas.courseId), resetCourseProgress);

export default router;
