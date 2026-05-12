import { User } from "../models/user.model.js";

import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

/**
 * Create a new user account
 * @route POST /api/v1/users/signup
 */
export const createUserAccount = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email and password", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists with this email", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "student"
  });

  generateToken(res, user, "Account created successfully");
});

/**
 * Authenticate user and get token
 * @route POST /api/v1/users/signin
 */
export const authenticateUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  generateToken(res, user, "Logged in successfully");
});

/**
 * Sign out user and clear cookie
 * @route POST /api/v1/users/signout
 */
export const signOutUser = catchAsync(async (_, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

/**
 * Get current user profile
 * @route GET /api/v1/users/profile
 */
export const getCurrentUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('enrolledCourses.course');
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

/**
 * Update user profile
 * @route PATCH /api/v1/users/profile
 */
export const updateUserProfile = catchAsync(async (req, res, next) => {
  const { name, bio } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (name) user.name = name;
  if (bio) user.bio = bio;

  // Handle avatar update
  if (req.file) {
    // Delete old avatar if it's not the default one
    if (user.avatar && !user.avatar.includes("default-avatar")) {
      // Extract public ID: handle Cloudinary URLs with folders
      const urlParts = user.avatar.split("/");
      const filename = urlParts.pop().split(".")[0].split("?")[0]; // Remove extension and query params
      const uploadIndex = urlParts.indexOf("upload");
      const folder = uploadIndex !== -1 ? urlParts.slice(uploadIndex + 2).join("/") : "";
      const publicId = folder ? `${folder}/${filename}` : filename;
      await deleteMediaFromCloudinary(publicId);
    }
    const result = await uploadMedia(req.file.path);
    user.avatar = result.secure_url;
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    user
  });
});

/**
 * Change user password
 * @route PATCH /api/v1/users/password
 */
export const changeUserPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!(await user.comparePassword(oldPassword))) {
    return next(new AppError("Invalid old password", 401));
  }

  if (!(await user.comparePassword(oldPassword))) {
    return next(new AppError("Invalid old password", 401));
  }

  user.password = newPassword;
  await user.save();

  generateToken(res, user, "Password changed successfully");
});

/**
 * Request password reset
 * @route POST /api/v1/users/forgot-password
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Please provide an email", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("There is no user with that email", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a POST request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent",
    });
  } catch (error) {
    console.error("Email could not be sent:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError("Email could not be sent", 500));
  }
});

/**
 * Reset password
 * @route POST /api/v1/users/reset-password/:token
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  if (!req.body.password) {
    return next(new AppError("Please provide a new password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  generateToken(res, user, "Password reset successfully");
});

/**
 * Delete user account
 * @route DELETE /api/v1/users/account
 */
export const deleteUserAccount = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Delete user avatar from cloudinary
  if (user.avatar && user.avatar !== "default-avatar.png") {
    const publicId = user.avatar.split("/").pop().split(".")[0];
    await deleteMediaFromCloudinary(publicId);
  }

  // Delete user
  await User.findByIdAndDelete(req.user._id);

  // Clear cookie
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User account deleted successfully"
  });
});
