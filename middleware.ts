import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PASSWORD_HASH = 'fc666fc9e4122a2d0c5477a9ecd4ea9f0335308acf5f5ae4449aa8b5ec2b3b2d';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow: login page, login API, static assets
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Bots pass through with valid x-bot-secret header
  const botSecret = req.headers.get('x-bot-secret');
  if (botSecret && process.env.BOT_SECRET && botSecret === process.env.BOT_SECRET) {
    return NextResponse.next();
  }

  // Check auth cookie
  const auth = req.cookies.get('site_auth')?.value;
  if (auth === PASSWORD_HASH) {
    return NextResponse.next();
  }

  // Redirect unauthenticated requests to /login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/login';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
