import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';
import { checkBotAuth } from '@/lib/auth';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = checkBotAuth(_req);
  if (denied) return denied;
  try {
    const { id } = params;
    if (!id || !/^[\w-]+$/.test(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const data = await dataStore.get('schedule') || { schedules: [] };
    const schedules = (data as { schedules: { id: string }[] }).schedules;
    const filtered = schedules.filter(s => s.id !== id);

    if (filtered.length === schedules.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await dataStore.set('schedule', { schedules: filtered });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
