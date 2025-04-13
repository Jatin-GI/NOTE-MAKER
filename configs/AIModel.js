// lib/ai.js (or wherever you're setting this up)
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

let chatSession;
let GenAiCode;

// This initializes the Gemini model + sessions
const initializeAI = async () => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("❌ GEMINI_API_KEY is not defined");

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    // Sessions
    chatSession = model.startChat({ history: [] });

    GenAiCode = model.startChat({
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
      history: [],
    });

    console.log("✅ Gemini model initialized.");
  } catch (error) {
    console.error("❌ AI Model Initialization Error:", error);
    throw new Error("Failed to initialize AI model");
  }
};

// Kick off initialization once
const aiReady = initializeAI();

// Export async getters (ensures they're ready when called)
export async function getChatSession() {
  await aiReady;
  return chatSession;
}

export async function getGenAiCode() {
  await aiReady;
  return GenAiCode;
}
