import { GoogleGenerativeAI } from "@google/generative-ai";
import { Course } from "../models/course.model.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY || "missing-api-key",
);

const model = process.env.GOOGLE_GEMINI_MODEL || "gemini-2.5-flash-lite";
const demoFallbackEnabled =
  process.env.NODE_ENV !== "production" &&
  process.env.AI_DEMO_FALLBACK === "true";

const createDemoResponse = ({ system, prompt, json }) => {
  const lowerSystem = system.toLowerCase();

  if (json && lowerSystem.includes("quiz")) {
    return JSON.stringify({
      questions: [
        {
          question: "What is the main learning goal of this lesson?",
          options: [
            "Understand the core concept",
            "Skip the fundamentals",
            "Memorize without context",
            "Avoid practice",
          ],
          answer: "Understand the core concept",
          explanation:
            "A good LMS lesson helps students connect the main idea with practical use.",
        },
      ],
    });
  }

  if (json && lowerSystem.includes("roadmap")) {
    return JSON.stringify({
      goal: "Project showcase learning path",
      duration: "4 weeks",
      weeklyPlan: [
        {
          week: 1,
          focus: "Fundamentals",
          tasks: ["Review course material", "Complete starter exercises"],
        },
        {
          week: 2,
          focus: "Practice",
          tasks: ["Build a small feature", "Take a short quiz"],
        },
      ],
      projects: ["Mini LMS feature demo"],
      milestones: ["Complete first module", "Present a working demo"],
    });
  }

  if (lowerSystem.includes("study assets")) {
    return [
      "## Demo Study Notes",
      "",
      "- Identify the main concept from the lesson.",
      "- Connect it to one practical example.",
      "- Review the common mistakes before moving forward.",
      "",
      "### Quick Review",
      "- What problem does this topic solve?",
      "- Where would you apply it in a real project?",
    ].join("\n");
  }

  const question = prompt.match(/Student question:\s*([\s\S]*)/)?.[1]?.trim();

  return [
    "I can help with that. For this LMS project demo, focus on the core idea first, then show how it works inside the course flow.",
    "",
    question ? `Your question: ${question}` : "",
    "",
    "Suggested next steps:",
    "1. Review the lesson objective.",
    "2. Try one small example.",
    "3. Mark progress after completing the lecture.",
  ]
    .filter(Boolean)
    .join("\n");
};

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
    const errorMessage = String(err?.message || "").toLowerCase();

    // Google Gemini quota exceeded or rate limited
    if (
      err?.status === 429 ||
      errorMessage.includes("quota") ||
      errorMessage.includes("resource_exhausted")
    ) {
      if (demoFallbackEnabled) {
        return createDemoResponse({ system, prompt, json });
      }

      throw new AppError(
        "AI quota exceeded. Please check your Google Gemini billing or try again later.",
        503,
      );
    }
    if (err?.status === 404 || errorMessage.includes("is not found")) {
      throw new AppError(
        `Configured Gemini model "${model}" is not available. Set GOOGLE_GEMINI_MODEL=gemini-2.5-flash-lite and restart the backend.`,
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
