"use client";
import React, { useState, useEffect, memo } from 'react';
import PixelSprite from '@/components/sprites/PixelSprite';
import StatusBadge from '@/components/StatusBadge';

const CountdownTimer = memo(({ targetTime }: { targetTime: string }) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetTime).getTime() - Date.now();
      if (diff <= 0) return '—';
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      return `in ${h}h ${m}m`;
    };
    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 60000);
    return () => clearInterval(t);
  }, [targetTime]);
  return <span className="text-[10px] text-smoke font-mono">{timeLeft}</span>;
});
CountdownTimer.displayName = 'CountdownTimer';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const agentColors: Record<string, string> = {
  overowa: '#f5c842',
  firefly: '#4ade80',
  stinger: '#fb923c',
};

type Schedule = {
  id: string;
  agent: string;
  name: string;
  type: string;
  status: string;
  cron: string;
  prompt_preview: string;
  next_run: string;
  last_run: string | null;
};

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [today] = useState(new Date());
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(d => setSchedules(d.schedules || []));
  }, []);

  // Build a map: "YYYY-MM-DD" -> schedule[]
  const eventMap: Record<string, Schedule[]> = {};
  for (const s of schedules) {
    if (!s.next_run) continue;
    const key = s.next_run.slice(0, 10);
    if (!eventMap[key]) eventMap[key] = [];
    eventMap[key].push(s);
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const selectedKey = selected
    ? `${selected.getFullYear()}-${String(selected.getMonth()+1).padStart(2,'0')}-${String(selected.getDate()).padStart(2,'0')}`
    : null;

  const selectedEvents = selectedKey ? (eventMap[selectedKey] || []) : [];

  const agentConfig: Record<string, { color: string; sprite: 'overowa' | 'firefly' | 'stinger' }> = {
    overowa: { color: 'text-yellowBright', sprite: 'overowa' },
    firefly: { color: 'text-greenBright', sprite: 'firefly' },
    stinger: { color: 'text-amberBright', sprite: 'stinger' },
  };

  return (
    <div className="p-6 h-full bg-base font-mono text-white flex gap-6">
      {/* Left: Calendar */}
      <div className="flex-1 min-w-0">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="text-smoke hover:text-white px-3 py-1 border border-border rounded hover:border-smoke transition-all"
          >
            ‹
          </button>
          <span className="text-lg font-bold tracking-widest uppercase">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="text-smoke hover:text-white px-3 py-1 border border-border rounded hover:border-smoke transition-all"
          >
            ›
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] uppercase text-smoke opacity-60 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const cellKey = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const isToday = cellKey === todayKey;
            const isSelected = cellKey === selectedKey;
            const events = eventMap[cellKey] || [];
            return (
              <button
                key={i}
                onClick={() => setSelected(new Date(year, month, day))}
                className={`relative p-2 rounded text-sm flex flex-col items-center min-h-[52px] transition-all border
                  ${isSelected ? 'bg-raised border-smoke' : 'border-transparent hover:bg-surface hover:border-border'}
                  ${isToday ? 'border-b-2 border-b-yellowBright' : ''}
                `}
              >
                <span className={`text-[12px] font-bold ${isToday ? 'text-yellowBright' : 'text-white'}`}>
                  {day}
                </span>
                {events.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {events.slice(0, 3).map((e, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: agentColors[e.agent] || '#888' }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day events */}
        {selected && (
          <div className="mt-6 border-t border-border pt-4">
            <div className="text-xs uppercase text-smoke opacity-60 mb-3 tracking-widest">
              {MONTHS[selected.getMonth()]} {selected.getDate()}, {selected.getFullYear()}
            </div>
            {selectedEvents.length === 0 ? (
              <div className="text-smoke opacity-40 text-sm">No events</div>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(e => {
                  const agent = agentConfig[e.agent];
                  return (
                    <div key={e.id} className="p-3 bg-surface border border-border rounded flex items-center gap-3">
                      {agent && <PixelSprite agentId={agent.sprite} className="w-6 h-6" />}
                      <div>
                        <div className="flex items-center gap-2">
                          {agent && <span className={`text-[10px] font-bold uppercase ${agent.color}`}>{e.agent}</span>}
                          <span className="text-sm text-white">{e.name}</span>
                        </div>
                        <div className="text-[10px] text-smoke opacity-60 mt-0.5">{e.prompt_preview}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Schedule list */}
      <div className="w-72 shrink-0 border-l border-border pl-6">
        <div className="text-xs uppercase text-smoke opacity-60 mb-4 tracking-widest">All Schedules</div>
        <div className="space-y-3">
          {schedules.map(job => {
            const agent = agentConfig[job.agent];
            return (
              <div key={job.id} className="p-3 bg-surface border border-border rounded hover:border-smoke transition-all">
                <div className="flex items-center gap-2 mb-1">
                  {agent && <PixelSprite agentId={agent.sprite} className="w-5 h-5" />}
                  <span className={`text-[10px] font-bold uppercase ${agent?.color || 'text-smoke'}`}>{job.agent}</span>
                  <StatusBadge label={job.status.toUpperCase()} type={job.status === 'active' ? 'ACTIVE' : 'DISABLED'} />
                </div>
                <div className="text-sm font-bold text-white mb-1">{job.name}</div>
                <div className="text-[10px] text-smoke opacity-60 mb-2">{job.cron}</div>
                {job.next_run && <CountdownTimer targetTime={job.next_run} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
