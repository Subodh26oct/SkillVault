import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";

export const getAdminAnalytics = catchAsync(async (req, res) => {
  const [users, courses, purchases] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    CoursePurchase.find({ status: "completed" }).select("amount currency"),
  ]);

  const revenue = purchases.reduce((total, purchase) => total + purchase.amount, 0);

  res.status(200).json({
    success: true,
    analytics: {
      users,
      courses,
      purchases: purchases.length,
      revenue,
    },
  });
});

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find()
    .select("-password -resetPasswordToken -resetPasswordExpire")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    users,
  });
});

export const updateUserRole = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { role: req.body.role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User role updated",
    user,
  });
});

export const deleteUserByAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await User.findByIdAndDelete(user._id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const getAllCoursesForAdmin = catchAsync(async (req, res) => {
  const courses = await Course.find()
    .populate({ path: "instructor", select: "name email avatar" })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    courses,
  });
});

export const getAllPaymentsForAdmin = catchAsync(async (req, res) => {
  const payments = await CoursePurchase.find()
    .populate({ path: "user", select: "name email" })
    .populate({ path: "course", select: "title price" })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    payments,
  });
});
