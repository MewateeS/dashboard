"use client";
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, X } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import { Task, TaskStatus, AgentId, TaskPriority } from '@/types';

const FIELD = "w-full bg-base border border-border px-3 py-2 text-[12px] text-white font-mono outline-none focus:border-smoke transition-colors rounded";

function AddTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (task: Task) => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignee: 'me' as AgentId,
    priority: 'normal' as TaskPriority,
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      assignee: form.assignee,
      priority: form.priority,
      status: 'backlog' as TaskStatus,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const newTask: Task = await res.json();
    onAdd(newTask);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        className="bg-surface border border-border rounded-xl p-6 w-full max-w-md font-mono text-white space-y-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-widest text-smoke font-bold">New Task</span>
          <button type="button" onClick={onClose}><X size={16} className="text-smoke hover:text-white" /></button>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-smoke mb-1">Title *</label>
          <input className={FIELD} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required autoFocus />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-smoke mb-1">Description</label>
          <textarea className={`${FIELD} resize-none`} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase text-smoke mb-1">Assignee</label>
            <select className={FIELD} value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value as AgentId }))}>
              {(['me', 'overowa', 'firefly', 'stinger'] as AgentId[]).map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase text-smoke mb-1">Priority</label>
            <select className={FIELD} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
              {(['urgent', 'normal', 'low'] as TaskPriority[]).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-smoke mb-1">Tags (comma-separated)</label>
          <input className={FIELD} placeholder="#code, #ui" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellowBright text-base text-[11px] font-bold uppercase rounded hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? 'Adding...' : '+ Add Task'}
        </button>
      </form>
    </div>
  );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-3 min-h-[500px] p-2 rounded-lg border border-dashed transition-colors ${
        isOver ? 'bg-raised border-smoke' : 'bg-surface/30 border-border'
      }`}
    >
      {children}
    </div>
  );
}

function DeleteBin({ visible }: { visible: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'bin' });
  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-dashed font-mono text-[11px] uppercase tracking-widest transition-all duration-200 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      } ${
        isOver
          ? 'bg-emberGlow/20 border-emberGlow text-emberGlow scale-110'
          : 'bg-surface border-border text-smoke'
      }`}
    >
      <Trash2 size={16} className={isOver ? 'text-emberGlow' : 'text-smoke'} />
      {isOver ? 'Release to delete' : 'Drag here to delete'}
    </div>
  );
}

function SortableTask({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data.tasks || []));
  }, []);

  const columns: { id: TaskStatus; label: string }[] = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ];

  const filteredTasks = tasks.filter(t => filter === 'all' || t.assignee === filter);

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    if (overId === 'bin') {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      return;
    }

    let newStatus: TaskStatus = 'backlog';
    if (overId === 'col-in-progress') newStatus = 'in-progress';
    else if (overId === 'col-done') newStatus = 'done';
    else if (overId === 'col-backlog') newStatus = 'backlog';
    else {
      const targetTask = tasks.find(t => t.id === overId);
      if (targetTask) newStatus = targetTask.status;
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  return (
    <div className="p-6 h-full font-mono text-white bg-base">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
          <h1 className="text-xl font-bold uppercase tracking-tighter">Task Board</h1>
          <div className="flex gap-2 bg-surface p-1 border border-border rounded">
            {['all', 'overowa', 'firefly', 'stinger', 'me'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-[10px] uppercase rounded transition-all ${filter === f ? 'bg-raised text-white' : 'text-smoke hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-yellowBright text-base text-[11px] font-bold uppercase rounded hover:opacity-90 transition-all"
        >
          + Add Task
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-3 gap-6 h-full">
          {columns.map(col => (
            <div key={col.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] uppercase text-smoke font-bold">{col.label}</span>
                <span className="text-[10px] text-smoke opacity-50">
                  {filteredTasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <DroppableColumn id={`col-${col.id}`}>
                <SortableContext
                  items={filteredTasks.filter(t => t.status === col.id).map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredTasks.filter(t => t.status === col.id).map(task => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      onClick={() => alert(`Task details for ${task.title}`)}
                    />
                  ))}
                </SortableContext>
              </DroppableColumn>
            </div>
          ))}
        </div>

        <DeleteBin visible={!!activeTask} />

        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeTask && (
            <div className="rotate-1 opacity-95 shadow-2xl">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={task => setTasks(prev => [...prev, task])}
        />
      )}
    </div>
  );
}
