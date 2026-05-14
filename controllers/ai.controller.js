import { GoogleGenerativeAI } from "@google/generative-ai";
import { Course } from "../models/course.model.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY || "missing-api-key",
);

const model = process.env.GOOGLE_GEMINI_MODEL || "gemini-1.5-flash";

const ensureGeminiKey = () => {
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new AppError("Google Gemini API key is not configured", 503);
  }
};

const createTextResponse = async ({ system, prompt, json = false }) => {
  ensureGeminiKey();

  try {
    const generativeModel = genAI.getGenerativeModel({ model });

    const fullPrompt = `${system}\n\n${prompt}`;

    const result = await generativeModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // If JSON is required, extract JSON from response
    if (json) {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          JSON.parse(jsonMatch[0]); // Validate JSON
          return jsonMatch[0];
        }
      } catch (e) {
        // If JSON parsing fails, return the text as is and let caller handle
      }
    }

    return text;
  } catch (err) {
    // Google Gemini quota exceeded or rate limited
    if (err?.status === 429 || err?.message?.includes("quota")) {
      throw new AppError(
        "AI quota exceeded. Please check your Google Gemini billing or try again later.",
        503,
      );
    }
    throw err;
  }
};

export const askLearningAssistant = catchAsync(async (req, res) => {
  const { message, context, courseId } = req.body;
  let courseContext = "";

  if (courseId) {
    const course = await Course.findById(courseId)
      .select("title subtitle description category level")
      .lean();
    if (course) {
      courseContext = `Course: ${course.title}\nLevel: ${course.level}\nCategory: ${course.category}\nDescription: ${course.description || course.subtitle || ""}`;
    }
  }

  const answer = await createTextResponse({
    system:
      "You are SkillVault's AI learning assistant. Explain clearly, avoid hallucinating, and give practical next steps for LMS students.",
    prompt: `${courseContext}\n\nExtra context: ${context || "None"}\n\nStudent question: ${message}`,
  });

  res.status(200).json({
    success: true,
    answer,
  });
});

export const generateQuiz = catchAsync(async (req, res) => {
  const { topic, lectureContent, difficulty, questionCount } = req.body;

  const content = await createTextResponse({
    json: true,
    system:
      'Generate LMS quiz JSON only. Use this exact shape: {"questions":[{"question":"","options":["","","",""],"answer":"","explanation":""}]}',
    prompt: `Topic: ${topic}\nDifficulty: ${difficulty}\nQuestion count: ${questionCount}\nLecture content: ${lectureContent || "No lecture content provided"}`,
  });

  res.status(200).json({
    success: true,
    quiz: JSON.parse(content),
  });
});

export const generateNotes = catchAsync(async (req, res) => {
  const { content, format } = req.body;

  const notes = await createTextResponse({
    system:
      "You turn lecture material into concise study assets. Use markdown headings, bullets, and review prompts.",
    prompt: `Create ${format} for this lecture content:\n\n${content}`,
  });

  res.status(200).json({
    success: true,
    notes,
  });
});

export const generateRoadmap = catchAsync(async (req, res) => {
  const { goal, currentLevel, weeklyHours, focusAreas } = req.body;

  const roadmap = await createTextResponse({
    json: true,
    system:
      'Generate personalized learning roadmap JSON only. Use this shape: {"goal":"","duration":"","weeklyPlan":[{"week":1,"focus":"","tasks":[""]}],"projects":[""],"milestones":[""]}',
    prompt: `Goal: ${goal}\nCurrent level: ${currentLevel}\nWeekly hours: ${weeklyHours}\nFocus areas: ${(focusAreas || []).join(", ")}`,
  });

  res.status(200).json({
    success: true,
    roadmap: JSON.parse(roadmap),
  });
});
