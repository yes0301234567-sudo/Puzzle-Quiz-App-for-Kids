import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize safe AI client; we will handle missing keys gracefully in the UI
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getMathHint = async (question: string): Promise<string> => {
  if (!ai) return "AI Hint unavailable (No API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain how to solve the math problem "${question}" to a 7-year-old child. 
      Keep it very short (max 2 sentences). Be encouraging and fun. Use an emoji.`,
    });
    return response.text || "Could not generate a hint.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I couldn't think of a hint right now.";
  }
};
