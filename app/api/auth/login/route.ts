import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';

// SHA-256 of "002040"
const PASSWORD_HASH = 'fc666fc9e4122a2d0c5477a9ecd4ea9f0335308acf5f5ae4449aa8b5ec2b3b2d';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const hash = createHash('sha256').update(password).digest('hex');
    const a = Buffer.from(hash);
    const b = Buffer.from(PASSWORD_HASH);
    const valid = a.length === b.length && timingSafeEqual(a, b);

    if (!valid) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set('site_auth', PASSWORD_HASH, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.VERCEL_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
