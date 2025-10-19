
import React, { useState } from 'react';
import { Feature, Settings } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { useTheme } from './hooks/useTheme';
import { NexusDashboard } from './components/NexusDashboard';
import { InteractionPane } from './components/InteractionPane';
import SettingsPanel from './components/SettingsPanel';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const [theme, toggleTheme] = useTheme();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const handleSelectFeature = (feature: Feature) => {
    setSelectedFeature(feature);
  };

  const handleBackToNexus = () => {
    setSelectedFeature(null);
  };
  
  return (
    <div className="relative min-h-screen w-full text-[var(--text)] bg-[var(--background)] font-[var(--font-body)]">
        {theme === 'dark' && <ParticleBackground />}
        <div className="relative z-10 flex h-screen p-4 gap-4">
            <main className={`flex-grow transition-all duration-500 ease-in-out ${selectedFeature ? 'w-full' : 'w-full'}`}>
                {selectedFeature ? (
                    <InteractionPane feature={selectedFeature} settings={settings} onBack={handleBackToNexus} />
                ) : (
                    <NexusDashboard onSelectFeature={handleSelectFeature} />
                )}
            </main>
            <aside className="w-80 flex-shrink-0 hidden lg:block">
                 <SettingsPanel settings={settings} setSettings={setSettings} theme={theme} toggleTheme={toggleTheme} />
            </aside>
        </div>
    </div>
  );
}

export default App;
