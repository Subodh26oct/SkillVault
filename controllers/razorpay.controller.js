import Razorpay from "razorpay";
import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = catchAsync(async (req, res, next) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  // Check if user already purchased the course
  const existingPurchase = await CoursePurchase.findOne({
    course: courseId,
    user: userId,
    status: 'completed'
  });

  if (existingPurchase) {
    return next(new AppError("You have already purchased this course", 400));
  }

  const amount = Math.round(course.price * 100); // Razorpay expects amount in smallest currency unit (paise for INR)

  const options = {
    amount,
    currency: "INR", // Assuming INR for Razorpay in India
    receipt: `receipt_order_${courseId}_${userId}`.substring(0, 40), // Max 40 chars
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    return next(new AppError("Failed to create Razorpay order", 500));
  }

  // Create pending purchase record
  const purchase = await CoursePurchase.create({
    course: courseId,
    user: userId,
    amount: course.price,
    currency: "INR",
    status: "pending",
    paymentMethod: "razorpay",
    paymentId: order.id
  });

  res.status(200).json({
    success: true,
    order,
    purchaseId: purchase._id
  });
});

export const verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseId, courseId } = req.body;
  const userId = req.user._id;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update purchase record
    const purchase = await CoursePurchase.findByIdAndUpdate(
      purchaseId,
      {
        status: "completed",
        paymentId: razorpay_payment_id
      },
      { new: true }
    );

    if (purchase) {
      // Enroll user in the course
      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { enrolledStudents: userId }
      });

      await User.findByIdAndUpdate(userId, {
        $push: { enrolledCourses: { course: courseId } }
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully"
    });
  } else {
    // Payment verification failed
    await CoursePurchase.findByIdAndUpdate(purchaseId, {
      status: "failed"
    });

    return next(new AppError("Invalid payment signature", 400));
  }
});
