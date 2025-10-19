
import React, { useState, useEffect } from 'react';
import { generateSingleShot, generateImages, generateAudio } from '../services/geminiService';
import { Feature, Settings } from '../types';
import Loader from './Loader';
import { SendIcon, PlayIcon } from './icons/Icons';

interface SingleShotInterfaceProps {
  feature: Feature;
  settings: Settings;
}

// Audio decode functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / 1; // 1 channel
  const buffer = ctx.createBuffer(1, frameCount, 24000); // 24000 sample rate

  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


const SingleShotInterface: React.FC<SingleShotInterfaceProps> = ({ feature, settings }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [audio, setAudio] = useState<{data: string, description: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  useEffect(() => {
    // Reset state when feature changes
    setPrompt('');
    setResponse(null);
    setImages([]);
    setAudio(null);
    setError(null);
    setIsLoading(false);
  }, [feature]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setImages([]);
    setAudio(null);
    
    try {
      if (feature.id === 'aetheric_vision') {
        const result = await generateImages(prompt, settings);
        if (result.images) setImages(result.images);
        if (result.error) setError(result.error);
      } else if (feature.id === 'resonance_engine') {
        if (!audioContext) {
          const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          setAudioContext(newAudioContext);
        }
        const result = await generateAudio(prompt, feature.systemInstruction, settings);
        if (result.audio && result.description) setAudio({data: result.audio, description: result.description});
        if (result.error) setError(result.error);

      } else {
        const result = await generateSingleShot(prompt, feature.model, feature.systemInstruction, settings);
        if (result.text) setResponse(result.text);
        if (result.error) setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async () => {
    if(!audio || !audio.data || !audioContext) return;
    try {
        const audioBuffer = await decodeAudioData(decode(audio.data), audioContext);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
    } catch (e) {
        console.error("Error playing audio: ", e);
        setError("Could not play audio.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 md:p-8 overflow-y-auto">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}
            {response && (
              <div className="bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)]">
                <pre className="whitespace-pre-wrap font-[var(--font-body)] text-base leading-relaxed">{response}</pre>
              </div>
            )}
            {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((imgSrc, index) => (
                  <img key={index} src={imgSrc} alt={`Generated art ${index + 1}`} className="rounded-lg border border-[var(--border)]" />
                ))}
              </div>
            )}
            {audio && (
              <div className="bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)] flex flex-col items-center gap-4">
                  <p className="italic text-center text-[var(--text)] opacity-80">"{audio.description}"</p>
                  <button onClick={playAudio} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] text-white hover:opacity-80 transition-opacity">
                      <PlayIcon className="w-5 h-5"/>
                      Play Soundscape
                  </button>
              </div>
            )}
            {!response && images.length === 0 && !audio && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] opacity-50">
                        {/* Placeholder Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.455-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold">Awaiting your command...</h2>
                    <p className="text-[var(--text)] opacity-60 mt-1">{feature.description}</p>
                </div>
            )}
          </>
        )}
      </div>
      <div className="p-4 border-t border-[var(--border)]">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Your prompt for ${feature.title}...`}
            className="w-full bg-[var(--surface)] text-[var(--text)] rounded-lg p-3 pr-12 resize-none border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            rows={2}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-[var(--primary)] hover:bg-primary/10 disabled:text-gray-500 disabled:hover:bg-transparent"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleShotInterface;
