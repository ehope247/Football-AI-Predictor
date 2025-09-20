import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { TeamStats, PredictionResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    predictedWinner: {
      type: Type.STRING,
      description: "The predicted winning team. Can be 'Draw' if no clear winner.",
    },
    predictedScore: {
      type: Type.STRING,
      description: "The predicted final score, e.g., '2-1'.",
    },
    analysis: {
      type: Type.STRING,
      description: "A brief analysis of the prediction, explaining the reasoning.",
    },
  },
  required: ["predictedWinner", "predictedScore", "analysis"],
};

export const generatePrediction = async (teamA: TeamStats, teamB: TeamStats): Promise<PredictionResult> => {
  const prompt = `
    Analyze the following football match stats and provide a prediction.

    Team A: ${teamA.name}
    - Last 5 Games Form (W-D-L): ${teamA.wins}-${teamA.draws}-${teamA.losses}
    - Average Goals Scored per game: ${teamA.avgGoalsScored}
    - Average Goals Conceded per game: ${teamA.avgGoalsConceded}

    Team B: ${teamB.name}
    - Last 5 Games Form (W-D-L): ${teamB.wins}-${teamB.draws}-${teamB.losses}
    - Average Goals Scored per game: ${teamB.avgGoalsScored}
    - Average Goals Conceded per game: ${teamB.avgGoalsConceded}

    Based on this data, predict the winner, the final score, and provide a short analysis of your reasoning.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert football analyst. Your task is to predict match outcomes based on provided stats. Your response must be in JSON format.",
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as PredictionResult;
  } catch (error) {
    console.error("Error generating prediction:", error);
    throw new Error("Failed to get prediction from AI. Please check the stats and try again.");
  }
};

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are 'Footy AI', a knowledgeable football expert. Your knowledge is strictly limited to football and other major sports. You must discuss historical matches, player stats, team news, and tactical analysis. If a user asks a question about a topic outside of sports, you must politely decline and state that your expertise is limited to the world of sports. Do not answer non-sports questions. Keep your tone engaging and conversational.",
    },
  });
};