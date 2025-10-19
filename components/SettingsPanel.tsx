
import React from 'react';
import { Settings, Theme } from '../types';
import { clearAllContexts } from '../services/geminiService';
import { SunIcon, MoonIcon, ClearIcon } from './icons/Icons';

interface SettingsPanelProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  theme: Theme;
  toggleTheme: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, theme, toggleTheme }) => {
  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleClearContext = () => {
    if (window.confirm("Are you sure you want to clear all conversation contexts? This cannot be undone.")) {
      clearAllContexts();
      alert("All contexts cleared.");
    }
  };

  return (
    <div className="w-full h-full bg-[var(--surface)] border-l border-[var(--border)] p-6 flex flex-col backdrop-blur-md overflow-y-auto">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-6">
        Aethel Controls
      </h2>
      
      <div className="space-y-6 flex-grow">
        {/* Response Detail */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] opacity-80 mb-2">Response Detail</label>
          <div className="flex space-x-2">
            {['Concise', 'Balanced', 'Elaborate'].map(option => (
              <button 
                key={option}
                onClick={() => handleSettingChange('responseBrevity', option as Settings['responseBrevity'])}
                className={`flex-1 py-1 px-2 text-sm rounded-md transition-colors ${settings.responseBrevity === option ? 'bg-[var(--primary)] text-white' : 'bg-black/20 text-[var(--text)] hover:bg-black/40'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* AI Temperament */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] opacity-80 mb-2">AI Temperament</label>
          <div className="flex space-x-2">
            {['Grounded', 'Imaginative', 'Surreal'].map(option => (
              <button 
                key={option}
                onClick={() => handleSettingChange('creativityLevel', option as Settings['creativityLevel'])}
                className={`flex-1 py-1 px-2 text-sm rounded-md transition-colors ${settings.creativityLevel === option ? 'bg-[var(--primary)] text-white' : 'bg-black/20 text-[var(--text)] hover:bg-black/40'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Persona Adherence */}
        <div>
          <label htmlFor="persona-adherence" className="block text-sm font-medium text-[var(--text)] opacity-80">Persona Adherence</label>
          <input 
            id="persona-adherence"
            type="range" 
            min="0" 
            max="100" 
            value={settings.personaPersistence}
            onChange={(e) => handleSettingChange('personaPersistence', parseInt(e.target.value))}
            className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
          <div className="flex justify-between text-xs text-[var(--text)] opacity-60">
            <span>Loose</span>
            <span>Strict</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-3">
        <button 
          onClick={toggleTheme} 
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-black/20 hover:bg-black/40 text-[var(--text)] transition-colors"
        >
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          <span>{theme === 'light' ? 'Void Mode' : 'Opal Mode'}</span>
        </button>
        <button 
          onClick={handleClearContext} 
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-black/20 hover:bg-black/40 text-[var(--text)] transition-colors"
        >
          <ClearIcon className="w-5 h-5" />
          <span>Clear All Contexts</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
