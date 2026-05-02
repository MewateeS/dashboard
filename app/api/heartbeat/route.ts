import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';

export async function GET() {
  try {
    const data = await dataStore.get('heartbeat') as { ts: number } | null;
    return NextResponse.json({ ts: data?.ts ?? null });
  } catch {
    return NextResponse.json({ ts: null });
  }
}

export async function POST(req: Request) {
  const expected = process.env.HEARTBEAT_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'HEARTBEAT_SECRET not configured' }, { status: 503 });
  }
  const secret = req.headers.get('x-heartbeat-secret');
  if (secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const ts = Date.now();
  await dataStore.set('heartbeat', { ts });
  return NextResponse.json({ ok: true, ts });
}
