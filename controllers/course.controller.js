import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

/**
 * Create a new course
 * @route POST /api/v1/courses
 */
export const createNewCourse = catchAsync(async (req, res, next) => {
  const { title, subtitle, description, category, level, price } = req.body;

  if (!title || !category || !price) {
    return next(new AppError("Course title, category, and price are required", 400));
  }

  if (!req.file) {
    return next(new AppError("Course thumbnail is required", 400));
  }

  const result = await uploadMedia(req.file.path);

  const course = await Course.create({
    title,
    subtitle,
    description,
    category,
    level,
    price,
    isPublished: req.body.isPublished === true || req.body.isPublished === "true",
    thumbnail: result.secure_url,
    instructor: req.user._id
  });

  // Add course to user's created courses
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCourses: course._id }
    });
  } catch (error) {
    await Course.findByIdAndDelete(course._id);
    throw error;
  }

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course
  });
});

/**
 * Search courses with filters
 * @route GET /api/v1/courses/search
 */
export const searchCourses = catchAsync(async (req, res, next) => {
  const { query = "", categories = [], sortByPrice = "" } = req.query;

  const searchCriteria = {
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { subtitle: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } }
    ]
  };

  if (categories.length > 0) {
    const categoryArray = typeof categories === 'string' ? categories.split(',') : categories;
    searchCriteria.category = { $in: categoryArray };
  }

  const sortOptions = {};
  if (sortByPrice === "low") {
    sortOptions.price = 1;
  } else if (sortByPrice === "high") {
    sortOptions.price = -1;
  }

  const courses = await Course.find(searchCriteria)
    .populate({ path: "instructor", select: "name avatar" })
    .sort(sortOptions);

  res.status(200).json({
    success: true,
    courses
  });
});

/**
 * Get all published courses
 * @route GET /api/v1/courses/published
 */
export const getPublishedCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({ isPublished: true })
    .populate({ path: "instructor", select: "name avatar" });

  res.status(200).json({
    success: true,
    courses
  });
});

/**
 * Get courses created by the current user
 * @route GET /api/v1/courses/my-courses
 */
export const getMyCreatedCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate({ path: "lectures", select: "title duration isPreview" });

  res.status(200).json({
    success: true,
    courses
  });
});

export const getInstructorAnalytics = catchAsync(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).select(
    "title price enrolledStudents isPublished createdAt"
  );
  const courseIds = courses.map((course) => course._id);
  const purchases = await CoursePurchase.find({
    course: { $in: courseIds },
    status: "completed",
  });

  const revenue = purchases.reduce((total, purchase) => total + purchase.amount, 0);
  const students = courses.reduce(
    (total, course) => total + course.enrolledStudents.length,
    0
  );

  res.status(200).json({
    success: true,
    analytics: {
      totalCourses: courses.length,
      publishedCourses: courses.filter((course) => course.isPublished).length,
      students,
      revenue,
      purchases: purchases.length,
    },
  });
});

/**
 * Update course details
 * @route PATCH /api/v1/courses/:courseId
 */
export const updateCourseDetails = catchAsync(async (req, res, next) => {
  const { title, subtitle, description, category, level, price, isPublished } = req.body;
  const courseId = req.params.courseId;

  let course = await Course.findById(courseId);

  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to update this course", 403));
  }

  let thumbnail = course.thumbnail;
  if (req.file) {
    if (course.thumbnail) {
      const publicId = course.thumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }
    const result = await uploadMedia(req.file.path);
    thumbnail = result.secure_url;
  }

  course = await Course.findByIdAndUpdate(
    courseId,
    {
    title,
      subtitle,
      description,
      category,
      level,
      price,
      isPublished,
      thumbnail
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    course
  });
});

export const deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId).populate("lectures");

  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You are not authorized to delete this course", 403));
  }

  if (course.thumbnail) {
    const publicId = course.thumbnail.split("/").pop().split(".")[0];
    await deleteMediaFromCloudinary(publicId);
  }

  await Promise.all(
    course.lectures.map(async (lecture) => {
      if (lecture.publicId) {
        await deleteMediaFromCloudinary(lecture.publicId);
      }
      await Lecture.findByIdAndDelete(lecture._id);
    })
  );

  await User.updateMany(
    {},
    {
      $pull: {
        createdCourses: course._id,
        enrolledCourses: { course: course._id },
      },
    }
  );
  await CoursePurchase.deleteMany({ course: course._id, status: { $ne: "completed" } });
  await Course.findByIdAndDelete(course._id);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

/**
 * Get course by ID
 * @route GET /api/v1/courses/:courseId
 */
export const getCourseDetails = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId)
    .populate({ path: "instructor", select: "name avatar bio" })
    .populate({ path: "lectures" });

  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  res.status(200).json({
    success: true,
    course
  });
});

/**
 * Add lecture to course
 * @route POST /api/v1/courses/:courseId/lectures
 */
export const addLectureToCourse = catchAsync(async (req, res, next) => {
  const { title, description, isPreview } = req.body;
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to add lectures to this course", 403));
  }

  if (!req.file) {
    return next(new AppError("Lecture video is required", 400));
  }

  const result = await uploadMedia(req.file.path);

  const lecture = await Lecture.create({
    title,
    description,
    videoUrl: result.secure_url,
    publicId: result.public_id || "placeholder_id",
    duration: Number(req.body.duration || 0),
    isPreview: isPreview === 'true' || isPreview === true,
    order: course.lectures.length + 1
  });

  course.lectures.push(lecture._id);
  await course.save();

  res.status(201).json({
    success: true,
    message: "Lecture added successfully",
    lecture
  });
});

export const deleteLectureFromCourse = catchAsync(async (req, res, next) => {
  const { courseId, lectureId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You are not authorized to delete lectures from this course", 403));
  }

  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    return next(new AppError("Lecture not found", 404));
  }

  if (lecture.publicId) {
    await deleteMediaFromCloudinary(lecture.publicId);
  }

  await Lecture.findByIdAndDelete(lectureId);
  course.lectures.pull(lectureId);
  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture deleted successfully",
  });
});

/**
 * Get course lectures
 * @route GET /api/v1/courses/:courseId/lectures
 */
export const getCourseLectures = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId).populate("lectures");

  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  res.status(200).json({
    success: true,
    lectures: course.lectures
  });
});
