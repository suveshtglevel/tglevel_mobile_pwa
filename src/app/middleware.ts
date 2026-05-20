import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read from cookies (middleware can't access localStorage directly)
  const userId = request.cookies.get('user_id')?.value;
  const isNewUser = request.cookies.get('isNewUser')?.value;

  // If user data exists → redirect to chat
  if (userId && (pathname === '/' || pathname === '/register')) {
    if (isNewUser === 'true') {
      return NextResponse.redirect(new URL('/terms-condition', request.url));
    }
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/register'],
};