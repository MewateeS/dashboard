import React from 'react';

interface StatusBadgeProps {
  label: string;
  type: 'ACTIVE' | 'STANDBY' | 'DAILY' | 'RECURRING' | 'ONE-SHOT' | 'DISABLED' | 'DONE';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, type }) => {
  const styles = {
    ACTIVE: 'bg-green-dim text-greenBright',
    STANDBY: 'bg-ash text-smoke',
    DAILY: 'bg-green-mid text-base',
    RECURRING: 'bg-amber-dim text-amberBright',
    'ONE-SHOT': 'bg-emberGlow/15 text-emberGlow',
    DISABLED: 'bg-raised text-ash',
    DONE: 'text-smoke line-through',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${styles[type]}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
