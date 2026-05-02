"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Pencil, X, Plus } from 'lucide-react';
import PixelSprite from '@/components/sprites/PixelSprite';
import { Project, AgentId, Task } from '@/types';

type SpriteId = 'overowa' | 'firefly' | 'stinger';

const AGENT_CONFIG: Record<string, { sprite: SpriteId; color: string; label: string }> = {
  overowa: { sprite: 'overowa', color: 'text-yellowBright', label: 'OverOwa' },
  firefly: { sprite: 'firefly', color: 'text-greenBright',  label: 'Firefly' },
  stinger: { sprite: 'stinger', color: 'text-amberBright',  label: 'Stinger' },
  me:      { sprite: 'overowa', color: 'text-smoke',        label: 'Me' },
};

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  active:    { label: 'ACTIVE',    dot: 'bg-greenBright shadow-[0_0_6px_#4ade80]', text: 'text-greenBright' },
  planning:  { label: 'PLANNING',  dot: 'bg-smoke',                                 text: 'text-smoke' },
  completed: { label: 'DONE',      dot: 'bg-yellowBright',                          text: 'text-yellowBright' },
  'on-hold': { label: 'ON HOLD',   dot: 'bg-emberGlow',                             text: 'text-emberGlow' },
};

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];

const BLANK: Partial<Project> = { name: '', description: '', status: 'planning', owner: 'me', color: '#3b82f6' };

function ProjectModal({
  initial, onClose, onSave,
}: {
  initial: Partial<Project>;
  onClose: () => void;
  onSave: (p: Project) => void;
}) {
  const [form, setForm] = useState({ ...BLANK, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!initial.id;

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(
        isEdit ? `/api/projects/${initial.id}` : '/api/projects',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) { setError((await res.json()).error || 'Failed'); return; }
      onSave(await res.json());
      onClose();
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <form
        className="bg-surface border border-border rounded-xl w-full max-w-md font-mono text-white overflow-hidden"
        onClick={e => e.stopPropagation()}
        onSubmit={submit}
      >
        {/* Color accent top bar */}
        <div className="h-1 w-full transition-all duration-300" style={{ backgroundColor: form.color }} />

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-smoke font-bold">
              {isEdit ? 'Edit Project' : 'New Project'}
            </span>
            <button type="button" onClick={onClose}><X size={15} className="text-smoke hover:text-white" /></button>
          </div>

          <div>
            <label className="text-[10px] uppercase text-smoke block mb-1">Name *</label>
            <input
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-white outline-none focus:border-smoke transition-colors"
              value={form.name || ''}
              onChange={e => set('name', e.target.value)}
              autoFocus required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-smoke block mb-1">Description</label>
            <textarea
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-white outline-none focus:border-smoke transition-colors resize-none"
              rows={2}
              value={form.description || ''}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase text-smoke block mb-1">Status</label>
              <select
                className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-white outline-none focus:border-smoke"
                value={form.status || 'planning'}
                onChange={e => set('status', e.target.value)}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase text-smoke block mb-1">Color</label>
              <div className="flex gap-1.5 flex-wrap mt-1">
                {COLORS.map(c => (
                  <button
                    key={c} type="button"
                    onClick={() => set('color', c)}
                    className={`w-5 h-5 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-base scale-110' : 'opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-smoke block mb-2">Owner</label>
            <div className="flex gap-2">
              {(Object.entries(AGENT_CONFIG) as [string, typeof AGENT_CONFIG[string]][]).map(([id, a]) => (
                <button
                  key={id} type="button"
                  onClick={() => set('owner', id)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded border transition-all flex-1
                    ${form.owner === id ? `${a.color} border-current bg-raised border-2` : 'border-border text-smoke hover:border-smoke'}`}
                >
                  <PixelSprite agentId={a.sprite} className="w-5 h-5" />
                  <span className="text-[8px] uppercase font-bold">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit" disabled={saving}
            className="w-full py-2.5 text-[11px] font-bold uppercase rounded tracking-widest transition-all disabled:opacity-50"
            style={{ backgroundColor: form.color, color: '#0a0a0a' }}
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : '+ Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="52" height="52" className="rotate-[-90deg]">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#1a1a1a" strokeWidth="4" />
      <circle
        cx="26" cy="26" r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modal, setModal] = useState<Partial<Project> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/tasks').then(r => r.json()),
    ]).then(([pd, td]) => {
      setProjects(pd.projects || []);
      setTasks(td.tasks || []);
      setLoading(false);
    });
  }, []);

  function getProgress(p: Project) {
    const linked = tasks.filter(t => p.taskIds.includes(t.id));
    if (!linked.length) return { pct: 0, done: 0, total: 0 };
    const done = linked.filter(t => t.status === 'done').length;
    return { pct: Math.round((done / linked.length) * 100), done, total: linked.length };
  }

  async function deleteProject(id: string) {
    setProjects(prev => prev.filter(p => p.id !== id));
    setConfirmDelete(null);
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  }

  function handleSave(saved: Project) {
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx !== -1) { const n = [...prev]; n[idx] = saved; return n; }
      return [...prev, saved];
    });
  }

  if (loading) {
    return (
      <div className="p-6 font-mono text-smoke text-[11px] uppercase tracking-widest animate-pulse">
        Loading projects…
      </div>
    );
  }

  return (
    <div className="p-6 bg-base min-h-full font-mono text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tighter">Projects</h1>
          <p className="text-[10px] text-smoke opacity-60 mt-0.5 uppercase tracking-widest">
            {projects.length} active mission{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModal(BLANK)}
          className="flex items-center gap-2 px-4 py-2 bg-raised border border-border text-[11px] uppercase tracking-widest text-smoke hover:text-white hover:border-smoke rounded transition-all"
        >
          <Plus size={13} /> New Project
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => {
          const { pct, done, total } = getProgress(project);
          const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.planning;
          const agent = AGENT_CONFIG[project.owner] || AGENT_CONFIG.me;

          return (
            <div
              key={project.id}
              className="relative bg-surface border border-border rounded-xl overflow-hidden group hover:border-smoke/50 transition-all duration-200"
            >
              {/* Top color accent */}
              <div className="h-[3px] w-full" style={{ backgroundColor: project.color }} />

              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <Link href={`/projects/${project.id}`}>
                      <h3 className="text-base font-bold text-white truncate hover:opacity-80 transition-opacity">
                        {project.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
                      <span className={`text-[9px] uppercase font-bold tracking-widest ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons — visible on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => setModal(project)}
                      className="w-7 h-7 flex items-center justify-center rounded border border-border text-smoke hover:text-white hover:border-smoke transition-all"
                      title="Edit"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(project.id)}
                      className="w-7 h-7 flex items-center justify-center rounded border border-border text-smoke hover:text-emberGlow hover:border-emberGlow transition-all"
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-smoke text-[11px] leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
                  {project.description || '—'}
                </p>

                {/* Progress */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <ProgressRing pct={pct} color={project.color} />
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
                      style={{ color: project.color }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-smoke opacity-60 mb-1.5 uppercase tracking-widest">
                      Progress
                    </div>
                    <div className="w-full bg-base rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: project.color }}
                      />
                    </div>
                    <div className="text-[10px] text-smoke opacity-50 mt-1">
                      {total === 0 ? 'No tasks linked' : `${done} / ${total} tasks done`}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <PixelSprite agentId={agent.sprite} className="w-5 h-5 flex-shrink-0" />
                  <span className={`text-[10px] font-bold uppercase ${agent.color}`}>{agent.label}</span>
                  <span className="text-[9px] text-smoke opacity-40 ml-auto">
                    {new Date(project.updated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-20 text-smoke opacity-40">
            <div className="text-4xl mb-4">◻</div>
            <div className="text-[11px] uppercase tracking-widest">No projects yet</div>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {modal && (
        <ProjectModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50" onClick={() => setConfirmDelete(null)}>
          <div
            className="bg-surface border border-emberGlow/50 rounded-xl p-6 w-80 font-mono text-white"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-[11px] uppercase tracking-widest text-emberGlow mb-2">Delete Project</div>
            <p className="text-sm text-smoke mb-6">
              This will permanently remove the project. Tasks won't be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 text-[11px] uppercase border border-border rounded text-smoke hover:text-white hover:border-smoke transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProject(confirmDelete)}
                className="flex-1 py-2 text-[11px] uppercase border border-emberGlow bg-emberGlow/10 rounded text-emberGlow hover:bg-emberGlow/20 transition-all font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
