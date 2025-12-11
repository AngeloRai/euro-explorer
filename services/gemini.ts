import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CountryData, QuizQuestion } from "../types";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const countrySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The common name of the country" },
    capital: { type: Type.STRING, description: "The capital city" },
    languages: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Main languages spoken",
    },
    population: {
      type: Type.STRING,
      description: "Approximate population in a kid-friendly format (e.g., '67 million')",
    },
    currency: { type: Type.STRING, description: "Currency used" },
    funFact: {
      type: Type.STRING,
      description: "A short, surprising, and fun fact about the country suitable for a 5th grader",
    },
    landmarks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING, description: "Short description of the landmark" },
        },
        required: ["name", "description"],
      },
      description: "Two famous landmarks",
    },
    foods: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING, description: "Short description of the food" },
        },
        required: ["name", "description"],
      },
      description: "Two traditional foods",
    },
    emoji: { type: Type.STRING, description: "The country's flag emoji" },
  },
  required: ["name", "capital", "languages", "population", "currency", "funFact", "landmarks", "foods", "emoji"],
};

const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "The quiz question" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "4 multiple choice options"
      },
      correctAnswerIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct answer" },
      explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct" }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"]
  }
};

// Helper function to retry API calls on 503 errors
const generateWithRetry = async (params: any, retries = 3): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      const isOverloaded = 
        error?.status === 503 || 
        error?.code === 503 || 
        error?.message?.includes('overloaded') ||
        (error?.error && error.error.code === 503);

      if (isOverloaded && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 500; // Exponential backoff + jitter
        console.warn(`Model overloaded (Attempt ${i + 1}/${retries}). Retrying in ${Math.round(delay)}ms...`);
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      throw error;
    }
  }
};

export const fetchCountryData = async (countryName: string): Promise<CountryData> => {
  try {
    const response = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: `Generate a fun, educational flashcard profile for the country "${countryName}". 
      Target audience: 5th grade students. 
      Tone: Enthusiastic, clear, and educational.
      Ensure the fun fact is genuinely interesting for a kid.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: countrySchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from Gemini");
    }

    return JSON.parse(text) as CountryData;
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
};

export const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: `Generate 5 fun and educational multiple-choice quiz questions about European countries.
      Cover topics like capitals, famous food, landmarks, and languages.
      Target audience: 5th grade students.
      Make the options plausible but clearly distinguishable.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No quiz data returned");
    }
    
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
}