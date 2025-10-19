
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-75 animate-ping"></div>
        <div className="relative w-24 h-24 rounded-full bg-black flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--background)] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
