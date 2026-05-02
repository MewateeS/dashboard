"use client";
import React, { useState, useEffect, memo } from 'react';
import PixelSprite from '@/components/sprites/PixelSprite';
import StatusBadge from '@/components/StatusBadge';

// Performance-optimized Countdown Component
const CountdownTimer = memo(({ targetTime }: { targetTime: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(targetTime).getTime() - Date.now();
      if (diff <= 0) return '—';
      
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      return `in ${hours}h ${mins}m`;
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => setTimeLeft(calculateTime()), 60000);
    return () => clearInterval(timer);
  }, [targetTime]);

  return <span className="text-[10px] text-smoke font-mono">{timeLeft}</span>;
});
CountdownTimer.displayName = 'CountdownTimer';

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [gCalEvents, setGCalEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<'daily' | 'recurring' | 'one-shot'>('daily');

  useEffect(() => {
    Promise.all([
      fetch('/api/schedule').then(res => res.json()),
      fetch('/api/calendar/google').then(res => res.json())
    ]).then(([schedData, gCalData]) => {
      setSchedules(schedData.schedules || []);
      setGCalEvents(gCalData.events || []);
    });
  }, []);

  const filteredSchedules = schedules.filter(s => s.type === filter);

  const agentConfig = {
    overowa: { color: 'text-yellowBright', sprite: 'overowa' as any },
    firefly: { color: 'text-greenBright', sprite: 'firefly' as any },
    stinger: { color: 'text-amberBright', sprite: 'stinger' as any },
  };

  return (
    <div className="p-6 h-full bg-base font-mono text-white">
      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8 items-center">
        <div className="flex gap-2 bg-surface p-1 border border-border rounded">
          {[
            { id: 'daily', color: 'bg-greenBright' },
            { id: 'recurring', color: 'bg-amberBright' },
            { id: 'one-shot', color: 'bg-emberGlow' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1 text-[10px] uppercase rounded transition-all flex items-center gap-2 ${filter === tab.id ? 'bg-raised text-white' : 'text-smoke hover:text-white'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${tab.color}`} />
              {tab.id}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Schedules */}
      <div className="space-y-3 mb-12">
        {filteredSchedules.map(job => {
          const agent = agentConfig[job.agent as keyof typeof agentConfig];
          return (
            <div key={job.id} className="p-4 bg-surface border border-border rounded flex items-center justify-between group hover:border-smoke transition-all">
              <div className="flex items-center gap-4">
                <PixelSprite agentId={agent.sprite} className="w-8 h-8" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${agent.color}`}>{job.agent}</span>
                    <span className="text-sm font-bold text-white">{job.name}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <StatusBadge label={job.type.toUpperCase()} type={job.type === 'daily' ? 'ACTIVE' : (job.type === 'recurring' ? 'RECURRING' : 'ONE-SHOT')} />
                    <StatusBadge label={job.status.toUpperCase()} type={job.status === 'active' ? 'ACTIVE' : 'DISABLED'} />
                  </div>
                  <div className="text-[10px] text-smoke mt-2 opacity-60 flex items-center gap-2">
                    <span className="font-bold">CRON:</span> {job.cron}
                  </div>
                  <div className="text-[11px] text-smoke truncate max-w-xs mt-1 opacity-80">
                    {job.prompt_preview}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-smoke mb-1">Next Run</div>
                <div className="bg-base px-2 py-1 border border-border rounded">
                  <CountdownTimer targetTime={job.next_run} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Google Calendar Section */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-xs font-bold uppercase text-smoke mb-4 tracking-widest flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-400" /> Calendar Events
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {gCalEvents.map(event => (
            <div key={event.id} className="p-3 bg-surface/50 border border-border rounded flex justify-between items-center opacity-80 hover:opacity-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="text-[10px] text-blue-400 font-bold uppercase">GCal</div>
                <span className="text-sm text-white">{event.summary}</span>
              </div>
              <span className="text-[10px] text-smoke">{new Date(event.start).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
