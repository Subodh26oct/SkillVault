import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/razorpay.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/zod.middleware.js";
import { paymentSchemas } from "../schemas/backend.schemas.js";

const router = express.Router();

router.post(
  "/create-order",
  isAuthenticated,
  validateRequest(paymentSchemas.courseIdBody),
  createRazorpayOrder
);
router.post(
  "/verify-payment",
  isAuthenticated,
  validateRequest(paymentSchemas.razorpayVerify),
  verifyPayment
);

export default router;
