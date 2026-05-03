"use client";
import React, { useState, useEffect, memo } from 'react';
import PixelSprite from '@/components/sprites/PixelSprite';
import StatusBadge from '@/components/StatusBadge';

type SpriteId = 'overowa' | 'firefly' | 'stinger';
const AGENTS: { id: string; label: string; sprite: SpriteId; color: string }[] = [
  { id: 'overowa', label: 'OverOwa', sprite: 'overowa', color: 'border-yellowBright text-yellowBright' },
  { id: 'firefly', label: 'Firefly', sprite: 'firefly', color: 'border-greenBright text-greenBright' },
  { id: 'stinger', label: 'Stinger', sprite: 'stinger', color: 'border-amberBright text-amberBright' },
];

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

const BLANK_FORM = { name: '', agent: 'overowa', type: 'daily', cron: '', prompt_preview: '', next_run: '' };

function AddModal({ onClose, onAdd, selectedDate }: { onClose: () => void; onAdd: (s: Schedule) => void; selectedDate: Date | null }) {
  const getInitialNextRun = () => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      d.setHours(9, 0, 0, 0);
      return d.toISOString();
    }
    return BLANK_FORM.next_run;
  };

  const [form, setForm] = useState({ ...BLANK_FORM, next_run: getInitialNextRun() });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed');
        return;
      }
      const created = await res.json();
      onAdd(created);
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <form
        className="bg-surface border border-border rounded-xl p-6 w-[420px] font-mono"
        onClick={e => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs uppercase tracking-widest text-smoke">New Schedule</span>
          <button type="button" onClick={onClose} className="text-smoke hover:text-white text-lg leading-none">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase text-smoke block mb-1">Name</label>
            <input
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-white outline-none focus:border-smoke"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Daily standup..."
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-smoke block mb-2">Agent</label>
            <div className="flex gap-2">
              {AGENTS.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => set('agent', a.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded border transition-all flex-1
                    ${form.agent === a.id ? `${a.color} bg-raised border-2` : 'border-border text-smoke hover:border-smoke'}`}
                >
                  <PixelSprite agentId={a.sprite} className="w-6 h-6" />
                  <span className="text-[9px] uppercase font-bold">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-smoke block mb-1">Type</label>
            <select
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-white outline-none focus:border-smoke"
              value={form.type}
              onChange={e => set('type', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="recurring">Recurring</option>
              <option value="one-shot">One-shot</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-smoke block mb-1">Cron Expression</label>
            <input
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-smoke"
              value={form.cron}
              onChange={e => set('cron', e.target.value)}
              placeholder="0 9 * * *"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-smoke block mb-1">Next Run (ISO date)</label>
            <input
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-white font-mono outline-none focus:border-smoke"
              value={form.next_run}
              onChange={e => set('next_run', e.target.value)}
              placeholder="2026-05-10T09:00:00Z"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-smoke block mb-1">Prompt Preview</label>
            <textarea
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-white outline-none focus:border-smoke resize-none"
              rows={2}
              value={form.prompt_preview}
              onChange={e => set('prompt_preview', e.target.value)}
              placeholder="What this job does..."
            />
          </div>
        </div>

        {error && <div className="text-red-400 text-xs mt-3">{error}</div>}

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-smoke hover:text-white border border-border rounded hover:border-smoke transition-all">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-xs text-white bg-raised border border-smoke rounded hover:bg-surface transition-all disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Add Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [today] = useState(new Date());
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(d => setSchedules(d.schedules || []));
  }, []);

  async function deleteSchedule(id: string) {
    const prev = schedules;
    setSchedules(s => s.filter(x => x.id !== id));
    const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
    if (!res.ok) setSchedules(prev);
  }

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
      {showAdd && (
        <AddModal
          onClose={() => setShowAdd(false)}
          onAdd={s => setSchedules(prev => [...prev, s])}
          selectedDate={selected}
        />
      )}

      {/* Left: Calendar */}
      <div className="flex-1 min-w-0">
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

        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] uppercase text-smoke opacity-60 py-1">{d}</div>
          ))}
        </div>

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
                <span className={`text-[12px] font-bold ${isToday ? 'text-yellowBright' : 'text-white'}`}>{day}</span>
                {events.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {events.slice(0, 3).map((e, idx) => (
                      <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: agentColors[e.agent] || '#888' }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-6 border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase text-smoke opacity-60 tracking-widest">
                {MONTHS[selected.getMonth()]} {selected.getDate()}, {selected.getFullYear()}
              </span>
              <button
                onClick={() => setShowAdd(true)}
                className="text-xs text-smoke hover:text-white border border-border rounded px-2 py-1 hover:border-smoke transition-all"
                title="Add schedule for this date"
              >
                +Add
              </button>
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {agent && <span className={`text-[10px] font-bold uppercase ${agent.color}`}>{e.agent}</span>}
                          <span className="text-sm text-white">{e.name}</span>
                        </div>
                        <div className="text-[10px] text-smoke opacity-60 mt-0.5 truncate">{e.prompt_preview}</div>
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
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase text-smoke opacity-60 tracking-widest">Schedules</span>
          <button
            onClick={() => setShowAdd(true)}
            className="w-6 h-6 flex items-center justify-center border border-border rounded text-smoke hover:text-white hover:border-smoke transition-all text-lg leading-none"
            title="Add schedule"
          >
            +
          </button>
        </div>
        <div className="space-y-3">
          {schedules.map(job => {
            const agent = agentConfig[job.agent];
            return (
              <div key={job.id} className="p-3 bg-surface border border-border rounded hover:border-smoke transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-1">
                    {agent && <PixelSprite agentId={agent.sprite} className="w-5 h-5" />}
                    <span className={`text-[10px] font-bold uppercase ${agent?.color || 'text-smoke'}`}>{job.agent}</span>
                    <StatusBadge label={job.status.toUpperCase()} type={job.status === 'active' ? 'ACTIVE' : 'DISABLED'} />
                  </div>
                  <button
                    onClick={() => deleteSchedule(job.id)}
                    className="text-smoke opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all text-xs leading-none ml-1 mt-0.5"
                    title="Delete"
                  >
                    ✕
                  </button>
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
