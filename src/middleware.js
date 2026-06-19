import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAdmin = request.cookies.get('admin_auth')?.value === 'true';
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
