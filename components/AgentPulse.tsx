import React, { useState } from 'react';

type AgentStatus = 'active' | 'processing' | 'idle';

interface AgentPulseProps {
  status: AgentStatus;
  detail: string;
}

const AgentPulse: React.FC<AgentPulseProps> = ({ status, detail }) => {
  const [isVisible, setIsVisible] = useState(false);

  const statusConfig = {
    active: {
      color: 'bg-greenBright',
      animation: '',
      label: 'Active',
    },
    processing: {
      color: 'bg-blue-400', // Neon blue for the "processing" vibe
      animation: 'animate-pulse',
      label: 'Processing',
    },
    idle: {
      color: 'bg-smoke',
      animation: '',
      label: 'Idle',
    },
  };

  const config = statusConfig[status];

  return (
    <div 
      className="relative flex items-center justify-center group w-6 h-6"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Status Dot */}
      <div 
        className={`w-3 h-3 rounded-full transition-all duration-300 ${config.color} ${config.animation}`}
      />

      {/* Tooltip */}
      {isVisible && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[11px] whitespace-nowrap z-10 bg-surface text-smoke border border-border font-mono">
          {detail}
        </div>
      )}
    </div>
  );
};

export default AgentPulse;
