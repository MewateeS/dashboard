export type AgentId = 'overowa' | 'firefly' | 'stinger' | 'me';
export type TaskStatus = 'backlog' | 'in-progress' | 'done';
export type TaskPriority = 'urgent' | 'normal' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: AgentId;
  priority: TaskPriority;
  tags: string[];
  created: string;
  updated: string;
}

export interface TaskData {
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  taskIds: string[];
  owner: AgentId;
  color: string;
  created: string;
  updated: string;
}

export interface ProjectData {
  projects: Project[];
}
