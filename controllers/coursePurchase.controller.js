import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe checkout session for course purchase
 * @route POST /api/v1/payments/create-checkout-session
 */
export const initiateStripeCheckout = catchAsync(async (req, res, next) => {
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

  // Create pending purchase record
  const purchase = await CoursePurchase.create({
    course: courseId,
    user: userId,
    amount: course.price,
    currency: "USD",
    status: "pending",
    paymentMethod: "stripe",
    paymentId: "pending" // Will be updated by webhook
  });

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            images: [course.thumbnail],
            description: course.subtitle || "Course access",
          },
          unit_amount: Math.round(course.price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/course-progress/${courseId}?success=true`,
    cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/course-details/${courseId}?canceled=true`,
    metadata: {
      courseId: courseId.toString(),
      userId: userId.toString(),
      purchaseId: purchase._id.toString()
    },
  });

  res.status(200).json({
    success: true,
    url: session.url
  });
});

/**
 * Handle Stripe webhook events
 * @route POST /api/v1/payments/webhook
 */
export const handleStripeWebhook = catchAsync(async (req, res, next) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];
    // Note: req.rawBody is populated by express.json() verify function in index.js
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const purchaseId = session.metadata.purchaseId;
    const courseId = session.metadata.courseId;
    const userId = session.metadata.userId;

    // Update purchase record
    const purchase = await CoursePurchase.findByIdAndUpdate(
      purchaseId,
      {
        status: "completed",
        paymentId: session.payment_intent || session.id
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
  }

  res.status(200).json({ received: true });
});

/**
 * Get course details with purchase status
 * @route GET /api/v1/payments/courses/:courseId/purchase-status
 */
export const getCoursePurchaseStatus = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  const purchase = await CoursePurchase.findOne({
    course: courseId,
    user: userId,
    status: 'completed'
  });

  res.status(200).json({
    success: true,
    isPurchased: !!purchase,
    purchase
  });
});

/**
 * Get all purchased courses
 * @route GET /api/v1/payments/purchased-courses
 */
export const getPurchasedCourses = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const purchases = await CoursePurchase.find({
    user: userId,
    status: 'completed'
  }).populate({
    path: 'course',
    select: 'title thumbnail instructor level',
    populate: {
      path: 'instructor',
      select: 'name avatar'
    }
  });

  const purchasedCourses = purchases.map(p => p.course);

  res.status(200).json({
    success: true,
    purchasedCourses
  });
});
