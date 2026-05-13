import express from "express";
import {
  deleteUserByAdmin,
  getAdminAnalytics,
  getAllCoursesForAdmin,
  getAllPaymentsForAdmin,
  getAllUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/zod.middleware.js";
import { adminSchemas } from "../schemas/backend.schemas.js";

const router = express.Router();

router.use(isAuthenticated, restrictTo("admin"));

router.get("/analytics", getAdminAnalytics);
router.get("/users", getAllUsers);
router.patch(
  "/users/:userId/role",
  validateRequest(adminSchemas.updateRole),
  updateUserRole
);
router.delete(
  "/users/:userId",
  validateRequest(adminSchemas.userId),
  deleteUserByAdmin
);
router.get("/courses", getAllCoursesForAdmin);
router.get("/payments", getAllPaymentsForAdmin);

export default router;
