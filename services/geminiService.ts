
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRaceAnalysis = async (query: string, driversContext: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are an expert racing analyst for the Zhuzhou Speed Festival.
        Current Context: ${driversContext}
        User Query: ${query}
        
        Provide a professional, insightful, and enthusiastic analysis in Chinese. 
        Keep it concise and focus on performance, standings, or general racing tips.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，由于技术原因，我现在无法提供分析。请稍后再试。";
  }
};
