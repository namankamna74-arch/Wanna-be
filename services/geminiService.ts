
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { Settings, ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const settingsToParams = (settings: Settings) => {
  const tempMap = { 'Grounded': 0.2, 'Imaginative': 0.7, 'Surreal': 1.0 };
  const tokensMap = { 'Concise': 1024, 'Balanced': 4096, 'Elaborate': 8192 };

  return {
    temperature: tempMap[settings.creativityLevel],
    maxOutputTokens: tokensMap[settings.responseBrevity],
  };
};

// This function is a placeholder for a more complex persona adherence logic
const applyPersonaAdherence = (systemInstruction: string, adherence: number): string => {
  if (adherence > 75) {
    return `${systemInstruction} CRITICAL: Adhere to this persona with maximum strictness. Do not deviate under any circumstances.`;
  }
  if (adherence < 25) {
    return `${systemInstruction} NOTE: You have creative freedom to interpret this persona loosely.`;
  }
  return systemInstruction;
};

export const generateSingleShot = async (
  prompt: string,
  modelName: string,
  systemInstruction: string,
  settings: Settings
): Promise<{ text?: string; images?: string[]; error?: string }> => {
  try {
    const generationConfig = settingsToParams(settings);
    const finalSystemInstruction = applyPersonaAdherence(systemInstruction, settings.personaPersistence);
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: finalSystemInstruction,
        ...generationConfig,
      }
    });

    return { text: response.text };
  } catch (error) {
    console.error("Gemini API Error (single-shot):", error);
    return { error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
};

export const generateImages = async (
  prompt: string,
  settings: Settings
): Promise<{ images?: string[]; error?: string }> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, in the style of cosmic voids, bio-luminescent flora, intricate filigree, celestial bodies, and vibrant, psychedelic color palettes`,
      config: {
        numberOfImages: 4,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      }
    });
    
    const images = response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
    return { images };
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return { error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
};

export const generateAudio = async (
  prompt: string,
  systemInstruction: string,
  settings: Settings
): Promise<{ audio?: string; description?: string; error?: string }> => {
    try {
        const descriptionGenerationConfig = settingsToParams(settings);
        const finalSystemInstruction = applyPersonaAdherence(systemInstruction, settings.personaPersistence);

        // First, generate the description
        const descriptionResponse = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: `Describe the ambient audio track for this prompt: "${prompt}"`,
          config: {
            systemInstruction: finalSystemInstruction,
            ...descriptionGenerationConfig,
          }
        });

        const description = descriptionResponse.text;

        if(!description){
            return { error: "Could not generate audio description." };
        }

        const ttsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: description }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            return { error: "Failed to generate audio data." };
        }
        
        return { audio: base64Audio, description };

    } catch (error) {
        console.error("Gemini Audio Generation Error:", error);
        return { error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

// Store chats in memory for this session
const chatInstances = new Map<string, Chat>();

export const getChat = (featureId: string, history: Content[], systemInstruction: string, settings: Settings): Chat => {
  if (chatInstances.has(featureId)) {
    return chatInstances.get(featureId)!;
  }
  
  const generationConfig = settingsToParams(settings);
  const finalSystemInstruction = applyPersonaAdherence(systemInstruction, settings.personaPersistence);

  const newChat = ai.chats.create({
    model: 'gemini-2.5-flash', // Default, can be overridden by feature
    history: history,
    config: {
      systemInstruction: finalSystemInstruction,
      ...generationConfig
    }
  });

  chatInstances.set(featureId, newChat);
  return newChat;
};

export const clearAllContexts = () => {
  chatInstances.clear();
}
