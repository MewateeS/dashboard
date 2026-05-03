import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-util';

const OPENCLAW_HOST = process.env.OPENCLAW_HOST || '192.168.223.115';
const OPENCLAW_PORT = process.env.OPENCLAW_PORT || '18789';
const OPENCLAW_URL = `http://${OPENCLAW_HOST}:${OPENCLAW_PORT}`;

export async function GET() {
  try {
    const endpoints = [`${OPENCLAW_URL}/healthz`, `${OPENCLAW_URL}/api/status`, `${OPENCLAW_URL}/health`];

    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(endpoint, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
          const ts = Date.now();
          await dataStore.set('heartbeat', { ts, source: 'openclaw' });
          return NextResponse.json({ ts, source: 'openclaw', endpoint });
        }
      } catch (fetchError) {
        // Continue to next endpoint
      }
    }

    // Return last known timestamp
    const data = await dataStore.get('heartbeat') as { ts: number; source?: string } | null;
    return NextResponse.json({ ts: data?.ts ?? null, source: data?.source ?? 'offline' });
  } catch {
    return NextResponse.json({ ts: null, source: 'error' });
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
  await dataStore.set('heartbeat', { ts, source: 'local' });
  return NextResponse.json({ ok: true, ts, source: 'local' });
}
