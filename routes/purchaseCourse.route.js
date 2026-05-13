import express from "express";
import {
  getCoursePurchaseStatus,
  getPurchasedCourses,
  handleStripeWebhook,
  initiateStripeCheckout,
} from "../controllers/coursePurchase.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/zod.middleware.js";
import { courseSchemas, paymentSchemas } from "../schemas/backend.schemas.js";

const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, validateRequest(paymentSchemas.courseIdBody), initiateStripeCheckout);
router
  .route("/webhook")
  .post(handleStripeWebhook);
router
  .route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, validateRequest(courseSchemas.courseId), getCoursePurchaseStatus);

router.route("/").get(isAuthenticated, getPurchasedCourses);

export default router;
