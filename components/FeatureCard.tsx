
import React from 'react';
import { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
  onSelect: (feature: Feature) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(feature)}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 cursor-pointer
                 backdrop-blur-md transition-all duration-300 ease-in-out
                 hover:scale-105 hover:border-[var(--primary)] hover:shadow-2xl hover:shadow-primary/20
                 flex flex-col h-full"
    >
      <h3 className="text-xl font-bold font-[var(--font-headings)] text-[var(--primary)] mb-2">{feature.title}</h3>
      <p className="text-[var(--text)] opacity-80 text-sm flex-grow">{feature.description}</p>
    </div>
  );
};
