import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';

export async function GET() {
  try {
    const data = await dataStore.get('schedule') || { schedules: [] };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}
