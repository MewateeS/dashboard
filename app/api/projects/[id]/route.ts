import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { ProjectData } from '@/types';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const data = (await dataStore.get('projects') as ProjectData) || { projects: [] };
    const project = data.projects.find(p => p.id === params.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
