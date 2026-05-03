import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { checkBotAuth } from '@/lib/auth';

const VALID_AGENTS = ['overowa', 'firefly', 'stinger'] as const;
const VALID_TYPES = ['daily', 'recurring', 'one-shot'] as const;

export async function GET() {
  try {
    const data = await dataStore.get('schedule') || { schedules: [] };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = checkBotAuth(req);
  if (denied) return denied;
  try {
    const body = await req.json();

    const name = String(body.name || '').trim().slice(0, 100);
    const agent = body.agent;
    const type = body.type;
    const cron = String(body.cron || '').trim().slice(0, 100);
    const prompt_preview = String(body.prompt_preview || '').trim().slice(0, 500);
    const next_run = String(body.next_run || '').trim();

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!VALID_AGENTS.includes(agent)) return NextResponse.json({ error: 'Invalid agent' }, { status: 400 });
    if (!VALID_TYPES.includes(type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    if (!cron) return NextResponse.json({ error: 'Cron is required' }, { status: 400 });

    const data = await dataStore.get('schedule') || { schedules: [] };
    const schedules = (data as { schedules: unknown[] }).schedules;

    const newEntry = {
      id: `cron-${Date.now()}`,
      agent,
      name,
      type,
      status: 'active',
      cron,
      timezone: 'UTC',
      prompt_preview,
      next_run: next_run || new Date().toISOString(),
      last_run: null,
    };

    schedules.push(newEntry);
    await dataStore.set('schedule', { schedules });
    return NextResponse.json(newEntry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
