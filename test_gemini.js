import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || "missing-api-key";
const modelName = process.env.GOOGLE_GEMINI_MODEL || "gemini-2.5-flash-lite";

console.log("Using API Key:", apiKey.substring(0, 8) + "...");
console.log("Using Model:", modelName);

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const generativeModel = genAI.getGenerativeModel({ model: modelName });
    console.log("Calling Gemini API...");
    const result = await generativeModel.generateContent("Say 'Gemini API is working!'");
    const response = await result.response;
    console.log("SUCCESS:", response.text());
  } catch (error) {
    console.error("FAILURE:", error);
  }
}

run();
