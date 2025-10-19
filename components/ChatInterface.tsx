
import React, { useState, useRef, useEffect } from 'react';
import { Feature, Settings, ChatMessage } from '../types';
import { getChat } from '../services/geminiService';
import { SendIcon } from './icons/Icons';
import { Content } from '@google/genai';

interface ChatInterfaceProps {
  feature: Feature;
  settings: Settings;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ feature, settings }) => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [history]);
  
  useEffect(() => {
    // Clear history when feature changes
    setHistory([]);
  }, [feature]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const geminiHistory: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
    
    const chat = getChat(feature.id, geminiHistory, feature.systemInstruction, settings);
    
    try {
      const result = await chat.sendMessageStream({ message: input });
      let text = '';
      for await (const chunk of result) {
        text += chunk.text;
        setHistory(prev => {
          const lastMessage = prev[prev.length - 1];
          if(lastMessage.role === 'model'){
            const newHistory = [...prev.slice(0, -1)];
            return [...newHistory, { role: 'model', content: text }];
          }
          return [...prev, { role: 'model', content: text }];
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setHistory(prev => [...prev, { role: 'model', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]'}`}>
              <pre className="whitespace-pre-wrap font-[var(--font-body)]">{msg.content}</pre>
            </div>
          </div>
        ))}
        {isLoading && history[history.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
                <div className="max-w-xl p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-[var(--border)]">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={`Message ${feature.title}...`}
            className="w-full bg-[var(--surface)] text-[var(--text)] rounded-lg p-3 pr-12 resize-none border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-[var(--primary)] hover:bg-primary/10 disabled:text-gray-500 disabled:hover:bg-transparent"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
