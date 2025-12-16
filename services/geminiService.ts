import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ResearchPaper } from "../types";

// Safely retrieve the API key, falling back to empty string if not found
// This prevents "ReferenceError: process is not defined" in some browser environments
const getApiKey = () => {
  try {
    // Prioritize GEMINI_API_KEY as per README.md, then fallback to API_KEY
    return process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();

// Initialize the client strictly with the API key
// If apiKey is empty, calls will fail gracefully later
const ai = new GoogleGenAI({ apiKey });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are the AI Research Assistant for the Ontario Educational Research Consortium (OERC). 
      Your goal is to assist educators, researchers, and students in finding information about educational theory, 
      Ontario curriculum context, and general research methodologies. 
      Be professional, academic yet accessible, and concise. 
      If asked about specific internal OERC documents you don't have access to, politely explain that you are a general assistant using the consortium's knowledge base context.`,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  if (!apiKey) {
    console.error("Gemini API Error: API_KEY is not set.");
    return "I'm sorry, I cannot connect to the research database. Please ensure your API key is configured correctly.";
  }
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I apologize, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the research database. Please try again later.";
  }
};

export const fetchResearchPapers = async (topic: string): Promise<ResearchPaper[]> => {
  if (!apiKey) {
    console.error("Gemini API Error: API_KEY is not set.");
    return [];
  }
  const model = 'gemini-2.5-flash';
  const searchTopic = topic.trim() || "current trends in Ontario education";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a list of 6 realistic research papers related to: "${searchTopic}". 
      Focus on academic tone suitable for an educational research consortium. 
      Ensure dates are between 2022 and 2025.
      Abstracts should be insightful but concise (approx 30-40 words).
      The author names should be diverse.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              date: { type: Type.STRING },
              abstract: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "title", "author", "date", "abstract", "tags"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Add random images and mock links since the text model doesn't generate them
    return data.map((paper: any, index: number) => ({
      ...paper,
      // Use a seed based on random math to ensure image is valid but random for each new search
      imageUrl: `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/800/600`,
      pdfUrl: '#', // Mock PDF link
      videoUrl: index % 2 === 0 ? 'https://www.youtube.com/embed/S_Th_iL5R0Q' : undefined // Mock video link for some papers
    }));
  } catch (error) {
    console.error("Error fetching research papers:", error);
    return [];
  }
};