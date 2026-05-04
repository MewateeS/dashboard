import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

export function checkBotAuth(req: Request): NextResponse | null {
  const secret = process.env.BOT_SECRET;
  if (!secret) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  const token = req.headers.get('x-bot-secret') ?? '';
  let valid = false;
  try {
    const a = Buffer.from(token), b = Buffer.from(secret);
    valid = a.length === b.length && timingSafeEqual(a, b);
  } catch { valid = false; }
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}
