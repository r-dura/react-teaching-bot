import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const sendMessage = async (message, teachings) => {
  try {
    const prompt = `Previous teachings: ${teachings.join('. ')}. User message: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return { message: text };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const testApiConnection = async () => {
  try {
    const prompt = "Hello, can you hear me? This is a test message.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("API Test Response:", text);
    return "API connection successful!";
  } catch (error) {
    console.error('Error testing API connection:', error);
    throw error;
  }
};