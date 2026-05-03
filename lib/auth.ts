import { NextResponse } from 'next/server';

export function checkBotAuth(req: Request): NextResponse | null {
  const secret = process.env.BOT_SECRET;
  if (!secret) return NextResponse.json({ error: 'Server misconfigured: BOT_SECRET not set' }, { status: 500 });
  const token = req.headers.get('x-bot-secret');
  if (token !== secret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}
