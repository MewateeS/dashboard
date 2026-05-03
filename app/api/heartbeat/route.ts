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
    // Try to read from public/heartbeat.json (written by heartbeat.sh)
    try {
      const origin = process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000';
      const response = await fetch(`${origin}/heartbeat.json`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (data.ts && Date.now() - data.ts < 90000) {
          return NextResponse.json({ ts: data.ts, online: true, source: 'heartbeat-script' });
        }
      }
    } catch {
      // File not available or parse error
    }

    // Fallback to stored data (for local dev)
    try {
      const data = await dataStore.get('heartbeat') as { ts: number; source?: string } | null;
      if (data?.ts && Date.now() - data.ts < 90000) {
        return NextResponse.json({ ts: data.ts, source: data.source ?? 'cached', online: true });
      }
    } catch {
      // dataStore not available
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
  await dataStore.set('heartbeat', { ts, source: 'local' });
  return NextResponse.json({ ok: true, ts, source: 'local' });
}
