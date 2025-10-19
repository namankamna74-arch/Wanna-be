
import React from 'react';

const ParticleBackground: React.FC = () => {
    // We create a large number of particles to fill the screen
    const particles = Array.from({ length: 50 });

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <style>
                {`
                    @keyframes drift {
                        0% { transform: translateY(0) translateX(0); opacity: 0; }
                        20% { opacity: 0.7; }
                        80% { opacity: 0.7; }
                        100% { transform: translateY(-100vh) translateX(var(--drift-x)); opacity: 0; }
                    }
                    .particle {
                        position: absolute;
                        border-radius: 50%;
                        background-color: var(--primary);
                        animation-name: drift;
                        animation-timing-function: linear;
                        animation-iteration-count: infinite;
                    }
                `}
            </style>
            {particles.map((_, i) => {
                const size = Math.random() * 2 + 1; // 1px to 3px
                const duration = Math.random() * 40 + 20; // 20s to 60s
                const delay = Math.random() * -60; // Start at different times
                const xPos = Math.random() * 100;
                const driftX = (Math.random() - 0.5) * 200; // Drift left or right

                return (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${xPos}vw`,
                            bottom: `-${size}px`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                            '--drift-x': `${driftX}px`,
                        } as React.CSSProperties}
                    />
                );
            })}
        </div>
    );
};

export default ParticleBackground;
