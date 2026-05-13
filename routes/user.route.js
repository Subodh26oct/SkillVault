import express from "express";
import {
    authenticateUser,
    changeUserPassword,
    createUserAccount,
    deleteUserAccount,
    forgotPassword,
    getCurrentUserProfile,
    refreshUserSession,
    resetPassword,
    signOutUser,
    updateUserProfile
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import upload from "../utils/multer.js";
import { validateRequest } from "../middleware/zod.middleware.js";
import { authSchemas } from "../schemas/backend.schemas.js";

const router = express.Router();

// Auth routes
router.post("/signup", validateRequest(authSchemas.signup), createUserAccount);
router.post("/signin", validateRequest(authSchemas.signin), authenticateUser);
router.post("/signout", signOutUser);
router.post("/refresh-token", isAuthenticated, refreshUserSession);
router.post("/forgot-password", validateRequest(authSchemas.forgotPassword), forgotPassword);
router.post("/reset-password/:token", validateRequest(authSchemas.resetPassword), resetPassword);

// Profile routes
router.get("/profile", isAuthenticated, getCurrentUserProfile);
router.patch("/profile", 
    isAuthenticated, 
    upload.single("avatar"), 
    validateRequest(authSchemas.updateProfile),
    updateUserProfile
);

// Password management
router.patch("/change-password",
    isAuthenticated,
    validateRequest(authSchemas.changePassword),
    changeUserPassword
);

// Account management
router.delete("/account", isAuthenticated, deleteUserAccount);

export default router;
