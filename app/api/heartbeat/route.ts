import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';

const OPENCLAW_HOST = process.env.OPENCLAW_HOST || '192.168.223.48';
const OPENCLAW_PORT = process.env.OPENCLAW_PORT || '18789';
const OPENCLAW_URL = `http://${OPENCLAW_HOST}:${OPENCLAW_PORT}`;

async function checkOpenclawOnline(): Promise<boolean> {
  const endpoints = [`${OPENCLAW_URL}/healthz`, `${OPENCLAW_URL}/api/status`, `${OPENCLAW_URL}/health`];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(endpoint, { method: 'GET', signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) return true;
    } catch {
      // Continue to next endpoint
    }
  }
  return false;
}

export async function GET() {
  try {
    const data = await dataStore.get('heartbeat') as { ts: number; source?: string; online?: boolean } | null;

    if (data?.ts && Date.now() - data.ts < 90000) {
      return NextResponse.json({ ts: data.ts, source: data.source ?? 'cached', online: true });
    }

    return NextResponse.json({ ts: null, source: 'offline', online: false });
  } catch {
    return NextResponse.json({ ts: null, source: 'error', online: false });
  }
}

export async function POST(req: Request) {
  const expected = process.env.HEARTBEAT_SECRET;
  if (expected) {
    const secret = req.headers.get('x-heartbeat-secret');
    if (secret !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  const ts = Date.now();
  try {
    await dataStore.set('heartbeat', { ts, source: 'heartbeat-script', online: true });
  } catch {
    // If storage fails, just return the timestamp
  }
  return NextResponse.json({ ok: true, ts, source: 'heartbeat-script', online: true });
}
