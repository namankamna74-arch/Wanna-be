
import React from 'react';
import { FEATURES } from '../constants';
import { Feature } from '../types';
import { FeatureCard } from './FeatureCard';

interface NexusDashboardProps {
  onSelectFeature: (feature: Feature) => void;
}

export const NexusDashboard: React.FC<NexusDashboardProps> = ({ onSelectFeature }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
          Aetheric Intelligence Suite
        </h1>
        <p className="text-lg text-[var(--text)] opacity-70 mt-2">Choose your persona to begin.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} onSelect={onSelectFeature} />
        ))}
      </div>
    </div>
  );
};
