import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { TaskData, TaskStatus, AgentId, TaskPriority } from '@/types';
const VALID_STATUSES:   TaskStatus[]   = ['backlog', 'in-progress', 'done'];
const VALID_ASSIGNEES:  AgentId[]      = ['overowa', 'firefly', 'stinger', 'me'];
const VALID_PRIORITIES: TaskPriority[] = ['urgent', 'normal', 'low'];

async function readData(): Promise<TaskData> {
  return (await dataStore.get('tasks') as TaskData) || { tasks: [] };
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await readData();
    const index = data.tasks.findIndex(t => t.id === params.id);
    if (index === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    data.tasks.splice(index, 1);
    await dataStore.set('tasks', data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const data = await readData();

    const index = data.tasks.findIndex(t => t.id === params.id);
    if (index === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const safeUpdates: Partial<TaskData['tasks'][number]> = {};
    if (typeof body.title === 'string')       safeUpdates.title       = body.title.trim().slice(0, 200);
    if (typeof body.description === 'string') safeUpdates.description = body.description.trim().slice(0, 2000);
    if (VALID_STATUSES.includes(body.status))     safeUpdates.status   = body.status;
    if (VALID_ASSIGNEES.includes(body.assignee))  safeUpdates.assignee = body.assignee;
    if (VALID_PRIORITIES.includes(body.priority)) safeUpdates.priority = body.priority;
    if (Array.isArray(body.tags))
      safeUpdates.tags = body.tags.slice(0, 20).map((t: unknown) => String(t).slice(0, 50));

    data.tasks[index] = { ...data.tasks[index], ...safeUpdates, updated: new Date().toISOString() };
    await dataStore.set('tasks', data);
    return NextResponse.json(data.tasks[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
