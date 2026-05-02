import React from 'react';

type AgentId = 'overowa' | 'firefly' | 'stinger';

interface PixelSpriteProps {
  agentId: AgentId;
  isActive?: boolean;
  className?: string;
}

const PixelSprite: React.FC<PixelSpriteProps> = ({ agentId, isActive, className = '' }) => {
  const size = 32;

  const sprites = {
    overowa: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Body */}
        <rect x="8" y="10" width="16" height="16" rx="4" fill="#FFE135" />
        {/* Eye */}
        <rect x="12" y="14" width="2" height="2" fill="#0c0e10" />
        <rect x="18" y="14" width="2" height="2" fill="#0c0e10" />
        {/* Beak */}
        <rect 
          x="14" y="18" width="4" height="2" fill="#FF8C32" 
          className={isActive ? 'animate-bounce' : ''} 
        />
        {/* Feet */}
        <rect x="10" y="26" width="2" height="2" fill="#FF8C32" />
        <rect x="20" y="26" width="2" height="2" fill="#FF8C32" />
      </svg>
    ),
    firefly: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Body */}
        <rect x="10" y="12" width="12" height="12" rx="2" fill="#2d5a3c" />
        {/* Head */}
        <rect x="14" y="8" width="4" height="4" fill="#39FF6A" />
        {/* Wings */}
        <rect x="6" y="12" width="4" height="6" rx="1" fill="#8896a8" opacity="0.6" />
        <rect x="22" y="12" width="4" height="6" rx="1" fill="#8896a8" opacity="0.6" />
        {/* Glowing Abdomen */}
        <rect 
          x="12" y="20" width="8" height="4" fill="#39FF6A" 
          className={isActive ? 'animate-pulse' : ''} 
        />
      </svg>
    ),
    stinger: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Body */}
        <rect x="10" y="10" width="12" height="14" rx="2" fill="#FF8C32" />
        {/* Stripes */}
        <rect x="10" y="14" width="12" height="2" fill="#0c0e10" />
        <rect x="10" y="18" width="12" height="2" fill="#0c0e10" />
        {/* Head */}
        <rect x="12" y="6" width="8" height="4" fill="#FF8C32" />
        {/* Stinger/Tail */}
        <rect 
          x="14" y="24" width="4" height="4" fill="#FF8C32" 
          className={isActive ? 'animate-pulse' : ''} 
        />
        {/* Wings */}
        <rect x="6" y="10" width="4" height="6" rx="1" fill="#e8edf2" opacity="0.4" />
        <rect x="22" y="10" width="4" height="6" rx="1" fill="#e8edf2" opacity="0.4" />
      </svg>
    ),
  };

  return sprites[agentId] || null;
};

export default PixelSprite;
