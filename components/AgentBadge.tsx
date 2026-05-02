import React from 'react';
import PixelSprite from './sprites/PixelSprite';

type AgentId = 'overowa' | 'firefly' | 'stinger';

interface AgentBadgeProps {
  agentId: AgentId;
  name: string;
  isActive?: boolean;
}

const AgentBadge: React.FC<AgentBadgeProps> = ({ agentId, name, isActive }) => {
  const colors = {
    overowa: 'text-yellowBright',
    firefly: 'text-greenBright',
    stinger: 'text-amberBright',
  };

  return (
    <div className="flex items-center gap-2 bg-surface border border-border p-2 rounded-md w-fit">
      <PixelSprite agentId={agentId} isActive={isActive} />
      <span className={`text-sm font-bold ${colors[agentId]}`}>{name}</span>
    </div>
  );
};

export default AgentBadge;
