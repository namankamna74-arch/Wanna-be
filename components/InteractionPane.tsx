
import React from 'react';
import { Feature, Settings } from '../types';
import ChatInterface from './ChatInterface';
import SingleShotInterface from './SingleShotInterface';
import { BackArrowIcon } from './icons/Icons';

interface InteractionPaneProps {
  feature: Feature;
  settings: Settings;
  onBack: () => void;
}

export const InteractionPane: React.FC<InteractionPaneProps> = ({ feature, settings, onBack }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl backdrop-blur-md overflow-hidden">
      <header className="flex items-center p-4 border-b border-[var(--border)] flex-shrink-0">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 text-[var(--text)] mr-4">
          <BackArrowIcon />
        </button>
        <div>
          <h2 className="text-xl font-bold text-[var(--primary)]">{feature.title}</h2>
          <p className="text-sm text-[var(--text)] opacity-70 hidden md:block">{feature.description}</p>
        </div>
      </header>
      <main className="flex-grow overflow-hidden">
        {feature.interaction.isChat ? (
          <ChatInterface feature={feature} settings={settings} />
        ) : (
          <SingleShotInterface feature={feature} settings={settings} />
        )}
      </main>
    </div>
  );
};
