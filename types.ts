
export type Theme = 'light' | 'dark';

export interface Settings {
  responseBrevity: 'Concise' | 'Balanced' | 'Elaborate';
  creativityLevel: 'Grounded' | 'Imaginative' | 'Surreal';
  personaPersistence: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  interaction: {
    isChat: boolean;
  };
  model: string;
  systemInstruction: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// A generic type for grounding chunks to avoid overly specific typing
export type GroundingChunk = {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
};
