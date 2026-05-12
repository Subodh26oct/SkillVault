import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
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
    thumbnail: result.secure_url,
    instructor: req.user._id
  });

  // Add course to user's created courses
  await User.findByIdAndUpdate(req.user._id, {
    $push: { createdCourses: course._id }
  });

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
  const courses = await Course.find({ instructor: req.user._id });

  res.status(200).json({
    success: true,
    courses
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
