import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// In AI Studio Build, GEMINI_API_KEY is automatically provided in the environment
const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features may not work correctly.");
}

export const ai = new GoogleGenAI({ apiKey });

export const MODELS = {
  CHAT: "gemini-3-flash-preview",
  ANALYSIS: "gemini-3-flash-preview",
};
