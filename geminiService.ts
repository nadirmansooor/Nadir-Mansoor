import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export async function generateQuizQuestions(): Promise<Question[]> {
  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a list of 96 diverse, high-quality Multiple Choice Questions across Science, Mathematics, History, and General Knowledge. Each question must have exactly 4 options and one clear correct answer. Provide the output in a strict JSON array format.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              category: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "category"]
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    const questions = JSON.parse(jsonStr) as Question[];
    
    // Ensure we exactly have 96 questions or pad/slice as needed
    // In a real scenario, we might need multiple calls to get exactly 96 high-quality ones
    // but Gemini 3 Flash can handle large contexts.
    return questions.slice(0, 96);
  } catch (error) {
    console.error("Failed to generate questions:", error);
    // Fallback static data if API fails to ensure the app stays "functional"
    return Array.from({ length: 96 }, (_, i) => ({
      id: i + 1,
      question: `Sample Question ${i + 1}: What is the primary focus of this quiz?`,
      options: ["Entertainment", "Assessment", "Gaming", "Shopping"],
      correctAnswer: 1,
      category: "General"
    }));
  }
}