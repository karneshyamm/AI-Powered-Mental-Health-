import { GoogleGenAI } from "@google/genai";

export const getAI = () => {
  const apiKey = 
    import.meta.env.VITE_GEMINI_API_KEY || 
    process.env.GEMINI_API_KEY || 
    process.env.API_KEY || 
    "";
  return new GoogleGenAI({ apiKey });
};

export const MODELS = {
  CHAT: "gemini-3-flash-preview",
  ANALYSIS: "gemini-3-flash-preview",
};
