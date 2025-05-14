import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
);

export const chatWithGemini = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = await model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful chatbot for our website." }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! Something went wrong.";
  }
};
