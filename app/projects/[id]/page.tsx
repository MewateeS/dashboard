import React from 'react';
import { notFound } from 'next/navigation';
import { Project, Task } from '@/types';
import projectsData from '@/data/projects.json';
import tasksData from '@/data/tasks.json';

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const project = projectsData.projects.find((p) => p.id === params.id) as Project | undefined;
  if (!project) notFound();

  const tasks = tasksData.tasks as Task[];
  const linkedTasks = tasks.filter(t => project.taskIds.includes(t.id));
  const completedTasks = linkedTasks.filter(t => t.status === 'done').length;
  const progress = linkedTasks.length > 0
    ? Math.round((completedTasks / linkedTasks.length) * 100)
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <h1 className="text-3xl font-bold text-white">{project.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
          <div className="text-gray-400 text-xs uppercase font-mono mb-2">Progress</div>
          <div className="text-2xl font-bold text-white mb-2">{progress}%</div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: project.color }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
          <div className="text-gray-400 text-xs uppercase font-mono mb-2">Status</div>
          <div className="text-xl font-semibold text-white capitalize">{project.status}</div>
        </div>

        <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
          <div className="text-gray-400 text-xs uppercase font-mono mb-2">Owner</div>
          <div className="text-xl font-semibold text-white">{project.owner}</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
        <p className="text-gray-400 leading-relaxed bg-gray-800 p-4 rounded-xl border border-gray-700">
          {project.description}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Linked Tasks</h2>
        <div className="space-y-3">
          {linkedTasks.length > 0 ? (
            linkedTasks.map(task => (
              <div
                key={task.id}
                className="p-4 rounded-lg bg-gray-800 border border-gray-700 flex justify-between items-center"
              >
                <div>
                  <span className="text-white font-medium">{task.title}</span>
                  <div className="text-xs text-gray-500 font-mono">{task.id}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-mono uppercase ${
                  task.status === 'done' ? 'text-green-400 bg-green-400/10' :
                  task.status === 'in-progress' ? 'text-blue-400 bg-blue-400/10' :
                  'text-gray-400 bg-gray-400/10'
                }`}>
                  {task.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic p-4 text-center border border-gray-700 rounded-xl">
              No tasks linked to this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
