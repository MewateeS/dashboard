import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { checkBotAuth } from '@/lib/auth';
import tasksData    from '@/data/tasks.json';
import projectsData from '@/data/projects.json';
import scheduleData from '@/data/schedule.json';
import agentsData   from '@/data/agents.json';
import missionData  from '@/data/mission.json';

// POST /api/seed  — seeds KV with initial data (skips keys that already exist)
// POST /api/seed?force=true  — overwrites everything
export async function POST(request: Request) {
  const denied = checkBotAuth(request);
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';

  const seeds: Record<string, unknown> = {
    tasks:    tasksData,
    projects: projectsData,
    schedule: scheduleData,
    agents:   agentsData,
    mission:  missionData,
  };

  const results: Record<string, string> = {};

  for (const [key, value] of Object.entries(seeds)) {
    const existing = await dataStore.get(key);
    if (existing && !force) {
      results[key] = 'skipped (already exists)';
    } else {
      await dataStore.set(key, value);
      results[key] = force && existing ? 'overwritten' : 'seeded';
    }
  }

  return NextResponse.json({ ok: true, results });
}
