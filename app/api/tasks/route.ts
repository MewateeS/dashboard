import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { TaskData, TaskStatus, AgentId, TaskPriority } from '@/types';

const VALID_STATUSES:   TaskStatus[]   = ['backlog', 'in-progress', 'done'];
const VALID_ASSIGNEES:  AgentId[]      = ['overowa', 'firefly', 'stinger', 'me'];
const VALID_PRIORITIES: TaskPriority[] = ['urgent', 'normal', 'low'];

export async function GET() {
  try {
    const data = (await dataStore.get('tasks') as TaskData) || { tasks: [] };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title    = typeof body.title === 'string'       ? body.title.trim().slice(0, 200)       : '';
    const desc     = typeof body.description === 'string' ? body.description.trim().slice(0, 2000) : '';
    const status   = VALID_STATUSES.includes(body.status)     ? body.status   : 'backlog';
    const assignee = VALID_ASSIGNEES.includes(body.assignee)  ? body.assignee : 'me';
    const priority = VALID_PRIORITIES.includes(body.priority) ? body.priority : 'normal';
    const tags     = Array.isArray(body.tags)
      ? body.tags.slice(0, 20).map((t: unknown) => String(t).slice(0, 50))
      : [];

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const data = (await dataStore.get('tasks') as TaskData) || { tasks: [] };
    const newTask = {
      id: crypto.randomUUID(),
      title, description: desc, status, assignee, priority, tags,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    data.tasks.push(newTask);
    await dataStore.set('tasks', data);
    return NextResponse.json(newTask);
  } catch {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
