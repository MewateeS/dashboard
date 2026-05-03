import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { ProjectData } from '@/types';
import { checkBotAuth } from '@/lib/auth';

const VALID_STATUSES = ['planning', 'active', 'completed', 'on-hold'] as const;
const VALID_OWNERS   = ['overowa', 'firefly', 'stinger', 'me'] as const;

export async function GET() {
  try {
    const data = (await dataStore.get('projects') as ProjectData) || { projects: [] };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = checkBotAuth(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    const data = (await dataStore.get('projects') as ProjectData) || { projects: [] };

    const name    = typeof body.name === 'string'        ? body.name.trim().slice(0, 200)         : '';
    const desc    = typeof body.description === 'string' ? body.description.trim().slice(0, 2000)  : '';
    const status  = VALID_STATUSES.includes(body.status) ? body.status : 'planning';
    const owner   = VALID_OWNERS.includes(body.owner)    ? body.owner  : 'me';
    const color   = typeof body.color === 'string' && /^#[0-9a-fA-F]{3,6}$/.test(body.color)
      ? body.color : '#3b82f6';
    const taskIds = Array.isArray(body.taskIds)
      ? body.taskIds.slice(0, 100).map((t: unknown) => String(t).slice(0, 50))
      : [];

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const newProject = {
      id: `p${Date.now()}`,
      name, description: desc, status, owner, color, taskIds,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    data.projects.push(newProject);
    await dataStore.set('projects', data);
    return NextResponse.json(newProject);
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
