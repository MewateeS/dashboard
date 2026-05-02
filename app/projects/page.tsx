import React from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import projectsData from '@/data/projects.json';

export default function ProjectsPage() {
  const projects = projectsData.projects as Project[];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                {project.status}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
              {project.name}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
              {project.description}
            </p>
            <div className="flex items-center text-xs text-gray-500 font-mono">
              <span>Owner: {project.owner}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
