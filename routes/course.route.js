import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createNewCourse,
  searchCourses,
  getPublishedCourses,
  getMyCreatedCourses,
  getInstructorAnalytics,
  updateCourseDetails,
  getCourseDetails,
  addLectureToCourse,
  getCourseLectures,
  deleteCourse,
  deleteLectureFromCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
import { validateRequest } from "../middleware/zod.middleware.js";
import { courseSchemas } from "../schemas/backend.schemas.js";

const router = express.Router();

// Public routes
router.get("/published", getPublishedCourses);
router.get("/search", searchCourses);

// Protected routes
router.use(isAuthenticated);

// Course management
router
  .route("/")
  .post(
    restrictTo("instructor"),
    upload.single("thumbnail"),
    validateRequest(courseSchemas.create),
    createNewCourse
  )
  .get(restrictTo("instructor"), getMyCreatedCourses);

router.get(
  "/instructor/analytics",
  restrictTo("instructor", "admin"),
  getInstructorAnalytics
);

// Course details and updates
router
  .route("/c/:courseId")
  .all(validateRequest(courseSchemas.courseId))
  .get(getCourseDetails)
  .patch(
    restrictTo("instructor"),
    upload.single("thumbnail"),
    validateRequest(courseSchemas.update),
    updateCourseDetails
  )
  .delete(restrictTo("instructor", "admin"), deleteCourse);

// Lecture management
router
  .route("/c/:courseId/lectures")
  .get(validateRequest(courseSchemas.courseId), getCourseLectures)
  .post(
    restrictTo("instructor"),
    upload.single("video"),
    validateRequest(courseSchemas.lecture),
    addLectureToCourse
  );

router
  .route("/c/:courseId/lectures/:lectureId")
  .delete(
    restrictTo("instructor", "admin"),
    validateRequest(courseSchemas.lectureId),
    deleteLectureFromCourse
  );

export default router;
