import { GoogleGenAI } from "@google/genai";

export const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const MODELS = {
  CHAT: "gemini-3-flash-preview",
  ANALYSIS: "gemini-3-flash-preview",
};
