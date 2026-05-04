import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { checkBotAuth } from '@/lib/auth';
import { isValidCron, isValidISODate } from '@/lib/validate';

const VALID_AGENTS = ['overowa', 'firefly', 'stinger'] as const;
const VALID_TYPES  = ['daily', 'recurring', 'one-shot'] as const;

export async function POST(req: Request) {
  const denied = checkBotAuth(req);
  if (denied) return denied;

  try {
    const body = await req.json();

    const name           = String(body.name           || '').trim().slice(0, 100);
    const agent          = body.agent;
    const type           = body.type  || 'one-shot';
    const cron           = String(body.cron           || '').trim().slice(0, 100);
    const prompt_preview = String(body.prompt_preview || '').trim().slice(0, 500);
    const next_run       = String(body.next_run       || '').trim();

    if (!name)  return NextResponse.json({ error: 'Name is required' },  { status: 400 });
    if (!VALID_AGENTS.includes(agent))  return NextResponse.json({ error: 'Invalid agent — must be overowa, firefly, or stinger' }, { status: 400 });
    if (!VALID_TYPES.includes(type))    return NextResponse.json({ error: 'Invalid type — must be daily, recurring, or one-shot' }, { status: 400 });
    if (!cron)  return NextResponse.json({ error: 'Cron expression is required' }, { status: 400 });
    if (!isValidCron(cron)) return NextResponse.json({ error: 'Invalid cron expression' }, { status: 400 });
    if (!isValidISODate(next_run)) return NextResponse.json({ error: 'Invalid next_run date' }, { status: 400 });

    const data      = await dataStore.get('schedule') || { schedules: [] };
    const schedules = (data as { schedules: unknown[] }).schedules;

    const newEntry = {
      id:             `cron-${Date.now()}`,
      agent,
      name,
      type,
      status:         'active',
      cron,
      timezone:       'UTC',
      prompt_preview,
      next_run:       next_run || new Date().toISOString(),
      last_run:       null,
    };

    schedules.push(newEntry);
    await dataStore.set('schedule', { schedules });

    return NextResponse.json(newEntry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch schedules from dataStore and format as calendar events
    const schedules = await dataStore.get('schedule') as any[] | null;

    if (!schedules || !Array.isArray(schedules)) {
      // Return mock data if no schedules exist
      return NextResponse.json({
        events: [
          { id: 'g1', summary: 'Project Sync', start: new Date(Date.now() + 86400000).toISOString(), end: '...', source: 'GCal' },
          { id: 'g2', summary: 'Design Review', start: new Date(Date.now() + 172800000).toISOString(), end: '...', source: 'GCal' },
        ]
      });
    }

    // Transform schedules into calendar events
    const events = schedules
      .filter(s => s.next_run)
      .map(s => ({
        id: s.id,
        summary: s.name,
        start: s.next_run,
        end: new Date(new Date(s.next_run).getTime() + 3600000).toISOString(), // 1 hour duration
        source: 'Schedule',
        agent: s.agent,
        type: s.type,
        cron: s.cron,
      }));

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json({ events: [] });
  }
}
