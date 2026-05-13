import OpenAI from "openai";
import { Course } from "../models/course.model.js";
import { catchAsync, AppError } from "../middleware/error.middleware.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "missing-api-key",
});

const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

const ensureOpenAIKey = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new AppError("OpenAI API key is not configured", 503);
  }
};

const createTextResponse = async ({ system, prompt, json = false }) => {
  ensureOpenAIKey();

  try {
    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.4,
      response_format: json ? { type: "json_object" } : undefined,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0]?.message?.content || "";
  } catch (err) {
    // OpenAI quota exceeded or rate limited
    if (err?.status === 429 || err?.code === "insufficient_quota") {
      throw new AppError(
        "AI quota exceeded. Please check your OpenAI billing or try again later.",
        503
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
      "Generate LMS quiz JSON only. Use this exact shape: {\"questions\":[{\"question\":\"\",\"options\":[\"\",\"\",\"\",\"\"],\"answer\":\"\",\"explanation\":\"\"}]}",
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
      "Generate personalized learning roadmap JSON only. Use this shape: {\"goal\":\"\",\"duration\":\"\",\"weeklyPlan\":[{\"week\":1,\"focus\":\"\",\"tasks\":[\"\"]}],\"projects\":[\"\"],\"milestones\":[\"\"]}",
    prompt: `Goal: ${goal}\nCurrent level: ${currentLevel}\nWeekly hours: ${weeklyHours}\nFocus areas: ${(focusAreas || []).join(", ")}`,
  });

  res.status(200).json({
    success: true,
    roadmap: JSON.parse(roadmap),
  });
});
