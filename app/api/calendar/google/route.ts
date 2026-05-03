import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';

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
