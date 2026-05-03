import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { ProjectData } from '@/types';
import { checkBotAuth } from '@/lib/auth';

const VALID_STATUSES = ['planning', 'active', 'completed', 'on-hold'] as const;
const VALID_OWNERS   = ['overowa', 'firefly', 'stinger', 'me'] as const;

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const data = (await dataStore.get('projects') as ProjectData) || { projects: [] };
    const project = data.projects.find(p => p.id === params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const denied = checkBotAuth(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    const data = (await dataStore.get('projects') as ProjectData) || { projects: [] };
    const idx = data.projects.findIndex(p => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const existing = data.projects[idx];
    const safe = {
      name:        typeof body.name === 'string'        ? body.name.trim().slice(0, 200)        : existing.name,
      description: typeof body.description === 'string' ? body.description.trim().slice(0, 2000) : existing.description,
      status:      VALID_STATUSES.includes(body.status)  ? body.status  : existing.status,
      owner:       VALID_OWNERS.includes(body.owner)     ? body.owner   : existing.owner,
      color:       typeof body.color === 'string' && /^#[0-9a-fA-F]{3,6}$/.test(body.color)
                     ? body.color : existing.color,
      updated:     new Date().toISOString(),
    };

    data.projects[idx] = { ...existing, ...safe };
    await dataStore.set('projects', data);
    return NextResponse.json(data.projects[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const denied = checkBotAuth(_request);
  if (denied) return denied;
  try {
    const { id } = params;
    if (!id || !/^[\w-]+$/.test(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    const data = (await dataStore.get('projects') as ProjectData) || { projects: [] };
    const filtered = data.projects.filter(p => p.id !== id);
    if (filtered.length === data.projects.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await dataStore.set('projects', { projects: filtered });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
