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
  const lowerPrompt = prompt.toLowerCase();

  // 1. MCQ / Quiz generation
  if (json && lowerSystem.includes("quiz")) {
    if (lowerPrompt.includes("flexbox")) {
      return JSON.stringify({
        questions: [
          {
            question: "Which CSS property is used to define a flex container?",
            options: [
              "display: flex",
              "display: block-flex",
              "flex-direction: row",
              "align-items: center"
            ],
            answer: "display: flex",
            explanation: "Setting 'display: flex' on a parent element turns it into a flex container, enabling flexbox layout for its direct children."
          },
          {
            question: "How do you align flex items along the main axis?",
            options: [
              "justify-content",
              "align-items",
              "align-content",
              "flex-flow"
            ],
            answer: "justify-content",
            explanation: "The 'justify-content' property aligns flex items along the main axis (horizontal by default, unless flex-direction is changed)."
          },
          {
            question: "What is the default value of the 'flex-direction' property?",
            options: [
              "row",
              "column",
              "row-reverse",
              "column-reverse"
            ],
            answer: "row",
            explanation: "By default, flex-direction is set to 'row', meaning flex items are placed horizontally from left to right."
          },
          {
            question: "Which property aligns flex items along the cross axis?",
            options: [
              "align-items",
              "justify-content",
              "flex-wrap",
              "order"
            ],
            answer: "align-items",
            explanation: "The 'align-items' property defines the default behavior for how flex items are laid out along the cross axis (vertical by default)."
          },
          {
            question: "What does the 'flex-grow' property do?",
            options: [
              "Allows a flex item to grow if necessary to fill space",
              "Sets the default size of a flex item",
              "Forces a flex item to wrap to the next line",
              "Shrinks a flex item when space is tight"
            ],
            answer: "Allows a flex item to grow if necessary to fill space",
            explanation: "The 'flex-grow' property specifies how much of the remaining space in the flex container should be assigned to the item."
          }
        ]
      });
    }

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

  // 2. Roadmap generation
  if (json && lowerSystem.includes("roadmap")) {
    if (lowerPrompt.includes("frontend") || lowerPrompt.includes("front-end")) {
      return JSON.stringify({
        goal: "Frontend Developer Career Path",
        duration: "12 weeks",
        weeklyPlan: [
          {
            week: 1,
            focus: "HTML5 & CSS3 Basics",
            tasks: [
              "Learn semantic HTML structures",
              "Master CSS Box Model, layouts (Flexbox/Grid), and responsive design"
            ]
          },
          {
            week: 2,
            focus: "JavaScript Fundamentals",
            tasks: [
              "Study variables, data types, and control flow",
              "Practice DOM manipulation and event handling"
            ]
          },
          {
            week: 3,
            focus: "Advanced JavaScript",
            tasks: [
              "Learn closures, scope, and ES6+ syntax",
              "Understand asynchronous JS (promises, async/await, API fetching)"
            ]
          },
          {
            week: 4,
            focus: "Git & Version Control",
            tasks: [
              "Learn Git commands (init, clone, commit, branch, merge)",
              "Deploy a static website on GitHub Pages or Vercel"
            ]
          },
          {
            week: 5,
            focus: "React Core Concepts",
            tasks: [
              "Learn JSX, components, props, and state",
              "Manage state with useState and handle side effects with useEffect"
            ]
          },
          {
            week: 6,
            focus: "React Advanced Techniques",
            tasks: [
              "Learn custom Hooks and Context API for global state",
              "Practice building dynamic list views and forms"
            ]
          },
          {
            week: 7,
            focus: "Next.js & App Router",
            tasks: [
              "Understand file-based routing and page layout",
              "Learn Server Components vs Client Components"
            ]
          },
          {
            week: 8,
            focus: "CSS Frameworks (Tailwind CSS)",
            tasks: [
              "Convert standard CSS classes into utility-first Tailwind classes",
              "Build a fully responsive dashboard layout"
            ]
          },
          {
            week: 9,
            focus: "API Integrations & State Management",
            tasks: [
              "Integrate RESTful APIs using Zustand or TanStack Query",
              "Handle loading states, cache management, and data updates"
            ]
          },
          {
            week: 10,
            focus: "Testing & Debugging",
            tasks: [
              "Write unit tests with Jest and React Testing Library",
              "Debug code using Chrome DevTools"
            ]
          },
          {
            week: 11,
            focus: "Performance Optimization",
            tasks: [
              "Learn image optimization, lazy loading, and code splitting",
              "Analyze bundle sizes and optimize render timings"
            ]
          },
          {
            week: 12,
            focus: "Final Capstone Project",
            tasks: [
              "Build and deploy a complete Next.js portfolio application",
              "Configure SEO settings, meta tags, and structured data"
            ]
          }
        ],
        projects: [
          "Personal Portfolio Site",
          "Interactive Weather App using Fetch API",
          "E-commerce Dashboard built with Next.js & Tailwind"
        ],
        milestones: [
          "Master JavaScript syntax and build simple logic",
          "Complete React core components and dynamic routing",
          "Deploy a fully responsive portfolio capstone project"
        ]
      });
    }

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

  // 3. Notes / Study assets generation
  if (lowerSystem.includes("study assets") || lowerSystem.includes("lecture material")) {
    return [
      "Demo Study Notes",
      "",
      "1. Identify the main concept from the lesson.",
      "2. Connect it to one practical example.",
      "3. Review the common mistakes before moving forward.",
      "",
      "Quick Review:",
      "- What problem does this topic solve?",
      "- Where would you apply it in a real project?",
    ].join("\n");
  }

  // 4. Chat assistant questions
  if (lowerPrompt.includes("closures")) {
    return [
      "Closures in JavaScript",
      "",
      "A closure is a fundamental concept in JavaScript where an inner function retains access to the variables of its outer (enclosing) function, even after the outer function has finished executing.",
      "",
      "Think of it as a function with a 'backpack' that carries the scope it was created in.",
      "",
      "Example Code:",
      "function createCounter() {",
      "  let count = 0;",
      "  return function() {",
      "    count++;",
      "    return count;",
      "  };",
      "}",
      "",
      "const counter = createCounter();",
      "console.log(counter()); // 1",
      "console.log(counter()); // 2",
      "",
      "In this example, createCounter has executed and returned. Normally, local variables like count would be cleaned up from memory. However, because the returned function retains a reference to count through a closure, the variable persists and can still be modified by calling counter().",
      "",
      "Real-world Use Cases:",
      "1. Data Privacy and Encapsulation: Restricting direct access to variables (like creating private variables).",
      "2. Function Factories: Generating functions with pre-configured values.",
      "3. State Maintenance: Keeping track of state in asynchronous operations or event handlers."
    ].join("\n");
  }

  if (lowerPrompt.includes("server components") || lowerPrompt.includes("rsc")) {
    return [
      "React Server Components (RSCs)",
      "",
      "React Server Components represent a new architecture developed by the React team to render components on the server, bringing the best of server-side rendering and client-side interactivity together.",
      "",
      "Here are the key concepts you need to know:",
      "",
      "1. Server vs. Client Components",
      "- Server Components: Render exclusively on the server. They have direct access to database queries, file systems, and backend resources. Their code is never sent to the client, which significantly reduces the JavaScript bundle size.",
      "- Client Components: Rendered on the server but hydrated on the client. These are used when you need user interactivity (like useState, useEffect, or event listeners).",
      "",
      "2. How RSCs Work",
      "When a page loads, Server Components are rendered into a lightweight JSON-like format. React on the client streams this data and merges it into the DOM. This allows Server Components to preserve client state (like inputs and scroll position) even when they re-render.",
      "",
      "3. Key Benefits:",
      "- Zero Client-Side JS: Component logic that only runs on the server doesn't add to the client bundle.",
      "- Direct Data Fetching: You can fetch data directly inside the component using standard async/await.",
      "- Better SEO and Performance: Faster initial page loads and improved search engine indexing."
    ].join("\n");
  }

  return [
    "I'm here to help you learn! For this LMS project demo, focus on the core concept first.",
    "",
    "Here are the general steps to solve your query:",
    "1. Identify the fundamental principle behind your question.",
    "2. Break it down into smaller sub-tasks.",
    "3. Write a simple implementation or sketch out the steps.",
    "4. Test and verify your solution.",
    "",
    "Feel free to ask a more specific question, or select one of the quick start topics (like JavaScript Closures, React Server Components, CSS Flexbox, or Frontend Roadmap) for a detailed example response!"
  ].join("\n");
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

    // Clean markdown characters (bold/heading indicators) for clean plain-text view
    const cleanedText = text
      .replace(/\*\*/g, "")
      .replace(/#/g, "")
      .trim();

    return cleanedText;
  } catch (err) {
    const errorMessage = String(err?.message || "").toLowerCase();

    // In development mode, fallback to demo response for any API errors
    if (demoFallbackEnabled) {
      console.log(`[AI Demo Fallback]: Gemini API error encountered, using mock data. Error: ${err.message}`);
      
      const rawDemo = createDemoResponse({ system, prompt, json });
      if (json) {
        return rawDemo;
      }
      
      // Clean markdown from demo response text
      return rawDemo
        .replace(/\*\*/g, "")
        .replace(/#/g, "")
        .trim();
    }

    // Google Gemini quota exceeded or rate limited
    if (
      err?.status === 429 ||
      errorMessage.includes("quota") ||
      errorMessage.includes("resource_exhausted")
    ) {
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
      "You are SkillVault's AI learning assistant. Be highly conversational, friendly, and natural. Avoid repeating standard intro templates, listing features, or giving robotic welcome guidelines when a student says hello or introduces themselves. Keep greetings and simple responses concise (under 2-3 sentences). Only provide structured study advice, concepts, or steps when specifically asked for learning help or technical explanations.",
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
