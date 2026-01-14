
import { GoogleGenAI } from "@google/genai";
import { SalesRecord } from "../types";

// Always initialize with the direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPerformanceInsights = async (sales: SalesRecord[], name: string) => {
  if (!process.env.API_KEY) return "AI insights currently unavailable.";

  const summary = sales.map(s => `${s.medicineName}: Qty ${s.quantity}, Val ${s.value}`).join('; ');
  
  try {
      const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this sales performance for ${name}: ${summary}. Provide 3 short actionable tips to increase sales and profit for Elder Laboratories. Keep it professional and motivational.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this moment.";
  }
};

export const getManagerSummary = async (allSales: SalesRecord[]) => {
  if (!process.env.API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on ${allSales.length} total shop visits today, summarize team performance. Focus on high-value products and overall revenue health.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    return "Manager summary generation failed.";
  }
};
