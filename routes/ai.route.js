import express from "express";
import {
  askLearningAssistant,
  generateNotes,
  generateQuiz,
  generateRoadmap,
} from "../controllers/ai.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/zod.middleware.js";
import { aiSchemas } from "../schemas/backend.schemas.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/assistant", validateRequest(aiSchemas.assistant), askLearningAssistant);
router.post("/quiz", validateRequest(aiSchemas.quiz), generateQuiz);
router.post("/notes", validateRequest(aiSchemas.notes), generateNotes);
router.post("/roadmap", validateRequest(aiSchemas.roadmap), generateRoadmap);

export default router;
