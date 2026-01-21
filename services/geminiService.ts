
import { GoogleGenAI } from "@google/genai";

// Security advisor logic powered by Gemini
export const getSecurityAdvice = async (userPrompt: string, connectionState: any) => {
  try {
    // Instantiate GoogleGenAI right before use to ensure the most current configuration (and API key) is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Context: The user is currently ${connectionState.status} to ${connectionState.server?.name || 'no server'}. 
      They are asking: "${userPrompt}"
      
      Act as a world-class cybersecurity expert for Jutt VPN. Provide concise, actionable advice regarding VPN usage, privacy, or security. If they ask about servers, suggest based on general knowledge (e.g., Switzerland for privacy, US for streaming).`,
      config: {
        systemInstruction: "You are the Jutt VPN AI Advisor. Be professional, secure-conscious, and brief.",
        temperature: 0.7,
      }
    });

    // The text property of the response contains the generated string
    return response.text;
  } catch (error: any) {
    console.error("Gemini AI error:", error);
    // Graceful fallback advice if the API fails
    return "I'm having trouble connecting to my secure database. Please ensure you are using a strong protocol like WireGuard for maximum security.";
  }
};
