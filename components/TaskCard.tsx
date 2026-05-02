import React from 'react';
import PixelSprite from '@/components/sprites/PixelSprite';
import StatusBadge from '@/components/StatusBadge';
import { Task, AgentId } from '@/types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const assigneeColors: Record<AgentId, { color: string, border: string, name: string, sprite: AgentId }> = {
    overowa: { color: 'text-yellowBright', border: 'border-yellowBright', name: 'OverOwa', sprite: 'overowa' },
    firefly: { color: 'text-greenBright', border: 'border-greenBright', name: 'Firefly', sprite: 'firefly' },
    stinger: { color: 'text-amberBright', border: 'border-amberBright', name: 'Stinger', sprite: 'stinger' },
    me: { color: 'text-smoke', border: 'border-smoke', name: 'Me', sprite: 'overowa' },
  };

  const priorityColors = {
    urgent: 'bg-emberGlow text-white',
    normal: 'bg-smoke text-base',
    low: 'bg-ash text-smoke',
  };

  const agent = assigneeColors[task.assignee] || assigneeColors.me;

  return (
    <div
      onClick={onClick}
      className={`p-3 bg-surface border-r border-t border-b border-border cursor-pointer transition-all hover:bg-raised group
        ${agent.border} border-l-2`
      }
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-white text-sm truncate">{task.title}</span>
        <StatusBadge label={task.priority.toUpperCase()} type={task.priority === 'urgent' ? 'ONE-SHOT' : 'STANDBY'} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <PixelSprite agentId={agent.sprite} className="w-4 h-4" />
        <span className={`text-[10px] font-bold uppercase ${agent.color}`}>{agent.name}</span>
      </div>

      <p className="text-smoke text-[12px] line-clamp-2 mb-3 leading-tight">
        {task.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map(tag => (
          <span key={tag} className="text-[9px] text-smoke opacity-60 bg-base px-1 rounded">{tag}</span>
        ))}
      </div>

      <div className="text-[11px] text-smoke opacity-40">
        {new Date(task.created).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskCard;
