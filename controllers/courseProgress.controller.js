import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

/**
 * Get user's progress for a specific course
 * @route GET /api/v1/progress/:courseId
 */
export const getUserCourseProgress = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  // Find or create progress
  let progress = await CourseProgress.findOne({ course: courseId, user: userId })
    .populate("course")
    .populate("lectureProgress.lecture");

  if (!progress) {
    // Initialize progress if it doesn't exist
    const initialLectureProgress = course.lectures.map(lectureId => ({
      lecture: lectureId,
      isCompleted: false,
      watchTime: 0
    }));

    progress = await CourseProgress.create({
      user: userId,
      course: courseId,
      lectureProgress: initialLectureProgress
    });

    progress = await CourseProgress.findById(progress._id)
      .populate("course")
      .populate("lectureProgress.lecture");
  }

  res.status(200).json({
    success: true,
    progress
  });
});

/**
 * Update progress for a specific lecture
 * @route PATCH /api/v1/progress/:courseId/lectures/:lectureId
 */
export const updateLectureProgress = catchAsync(async (req, res, next) => {
  const { courseId, lectureId } = req.params;
  const { isCompleted, watchTime } = req.body;
  const userId = req.user._id;

  const progress = await CourseProgress.findOne({ course: courseId, user: userId });
  if (!progress) {
    return next(new AppError("Course progress not found. Start the course first.", 404));
  }

  const lectureProgressIndex = progress.lectureProgress.findIndex(
    lp => lp.lecture.toString() === lectureId
  );

  if (lectureProgressIndex === -1) {
    // If lecture is not in progress array (e.g. newly added lecture), add it
    progress.lectureProgress.push({
      lecture: lectureId,
      isCompleted: isCompleted !== undefined ? isCompleted : false,
      watchTime: watchTime || 0,
      lastWatched: Date.now()
    });
  } else {
    if (isCompleted !== undefined) {
      progress.lectureProgress[lectureProgressIndex].isCompleted = isCompleted;
    }
    if (watchTime !== undefined) {
      progress.lectureProgress[lectureProgressIndex].watchTime = watchTime;
    }
    progress.lectureProgress[lectureProgressIndex].lastWatched = Date.now();
  }

  // Pre-save hook will calculate total completion percentage
  progress.lastAccessed = Date.now();
  await progress.save();

  res.status(200).json({
    success: true,
    message: "Lecture progress updated",
    progress
  });
});

/**
 * Mark entire course as completed
 * @route PATCH /api/v1/progress/:courseId/complete
 */
export const markCourseAsCompleted = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  const progress = await CourseProgress.findOne({ course: courseId, user: userId });
  if (!progress) {
    return next(new AppError("Course progress not found", 404));
  }

  // Mark all lectures as completed
  progress.lectureProgress.forEach(lp => {
    lp.isCompleted = true;
  });

  // Pre-save hook will update completionPercentage to 100
  progress.lastAccessed = Date.now();
  await progress.save();

  res.status(200).json({
    success: true,
    message: "Course marked as completed",
    progress
  });
});

/**
 * Reset course progress
 * @route PATCH /api/v1/progress/:courseId/reset
 */
export const resetCourseProgress = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  const progress = await CourseProgress.findOne({ course: courseId, user: userId });
  if (!progress) {
    return next(new AppError("Course progress not found", 404));
  }

  // Reset all lectures
  progress.lectureProgress.forEach(lp => {
    lp.isCompleted = false;
    lp.watchTime = 0;
  });

  progress.lastAccessed = Date.now();
  await progress.save();

  res.status(200).json({
    success: true,
    message: "Course progress reset",
    progress
  });
});
