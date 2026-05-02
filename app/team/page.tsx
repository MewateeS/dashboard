import React from 'react';
import PixelSprite from '@/components/sprites/PixelSprite';
import StatusBadge from '@/components/StatusBadge';
import missionData from '@/data/mission.json';
import agentsData from '@/data/agents.json';

const COLORS = {
  surface: '#141820',
  base: '#0c0e10',
  border: '#252d3a',
  yellow: '#FFE135',
  smoke: '#94a3b8',
};

export default function TeamPage() {
  const overOwa = agentsData.find(a => a.name === 'OverOwa');
  const firefly = agentsData.find(a => a.name === 'Firefly');
  const stinger = agentsData.find(a => a.name === 'Stinger');

  return (
    <div className="min-h-screen p-6 space-y-8 font-mono text-white" style={{ backgroundColor: COLORS.base }}>
      {/* 1. MISSION */}
      <section className="text-center max-w-2xl mx-auto italic text-smoke opacity-80">
        "{missionData.quote}"
      </section>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* 2. FOUNDER */}
        <div 
          className="p-4 border-l-4" 
          style={{ backgroundColor: COLORS.surface, borderRightWidth: '1px', borderTopWidth: '1px', borderBottomWidth: '1px', borderLeftColor: COLORS.yellow, borderRightColor: COLORS.border, borderTopColor: COLORS.border, borderBottomColor: COLORS.border }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ash rounded flex items-center justify-center text-xs font-bold text-smoke">USER</div>
            <div className="text-sm uppercase tracking-wider">
              You <span className="text-smoke">· Founder · Human</span>
            </div>
          </div>
        </div>

        {/* 3. OVEROWA */}
        <div 
          className="p-6 relative overflow-hidden" 
          style={{ backgroundColor: COLORS.surface, border: `3px solid ${COLORS.yellow}` }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <PixelSprite agentId="overowa" isActive={true} className="w-12 h-12" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold uppercase tracking-tighter" style={{ color: COLORS.yellow }}>OverOwa</span>
                <span className="text-xs uppercase tracking-widest text-smoke">Chief of Staff</span>
              </div>
              <div className="flex gap-2">
                <StatusBadge label={overOwa?.model || 'unknown'} type="ACTIVE" />
                <StatusBadge label="ALWAYS ON" type="ACTIVE" />
              </div>
              <p className="text-sm text-smoke max-w-md">
                The crew's brain. Routes tasks to Firefly and Stinger, reports back.
              </p>
              <div className="text-xs text-smoke mt-4 p-2 bg-base rounded border border-border">
                <span className="uppercase font-bold mr-2">Current Status:</span>
                {overOwa?.status || 'Idle'}
              </div>
            </div>
          </div>
        </div>

        {/* 4. PIPELINE */}
        <div className="flex justify-center py-8">
          <svg width="400" height="60" viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0 0 L10 5 L0 10 Z" fill={COLORS.border} />
              </marker>
            </defs>
            <text x="20" y="35" fill={COLORS.smoke} fontSize="10" className="uppercase font-mono">You</text>
            <line x1="60" y1="30" x2="130" y2="30" stroke={COLORS.border} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="140" y="35" fill={COLORS.smoke} fontSize="10" className="uppercase font-mono">OverOwa</text>
            <line x1="210" y1="30" x2="270" y2="15" stroke={COLORS.border} strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="210" y1="30" x2="270" y2="45" stroke={COLORS.border} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="280" y="15" fill={COLORS.smoke} fontSize="10" className="uppercase font-mono">Firefly</text>
            <text x="280" y="45" fill={COLORS.smoke} fontSize="10" className="uppercase font-mono">Stinger</text>
          </svg>
        </div>

        {/* 5. AGENT CREW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firefly */}
          <div 
            className="p-4 flex flex-col gap-4" 
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center gap-4">
              <PixelSprite agentId="firefly" isActive={firefly?.status === 'active'} className="w-12 h-12" />
              <div>
                <div className="text-sm font-bold uppercase tracking-tight text-green-400">Firefly</div>
                <div className="text-[10px] uppercase text-smoke">Coder</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={firefly?.model || 'unknown'} type="STANDBY" />
              <StatusBadge label="On-demand" type="STANDBY" />
              <StatusBadge label={firefly?.status || 'idle'} type={firefly?.status === 'active' ? 'ACTIVE' : 'STANDBY'} />
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-[10px] text-smoke uppercase">
              <span>Reports to: OverOwa</span>
              <span>Last active: {firefly?.lastActive || 'N/A'}</span>
            </div>
          </div>

          {/* Stinger */}
          <div 
            className="p-4 flex flex-col gap-4" 
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center gap-4">
              <PixelSprite agentId="stinger" isActive={stinger?.status === 'active'} className="w-12 h-12" />
              <div>
                <div className="text-sm font-bold uppercase tracking-tight text-orange-400">Stinger</div>
                <div className="text-[10px] uppercase text-smoke">Researcher</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={stinger?.model || 'unknown'} type="STANDBY" />
              <StatusBadge label="On-demand" type="STANDBY" />
              <StatusBadge label={stinger?.status || 'idle'} type={stinger?.status === 'active' ? 'ACTIVE' : 'STANDBY'} />
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-[10px] text-smoke uppercase">
              <span>Reports to: OverOwa</span>
              <span>Last active: {stinger?.lastActive || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
