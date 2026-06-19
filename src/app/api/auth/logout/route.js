import { NextResponse } from 'next/server';

export async function POST(request) {
  // Using absolute URL for redirect inside route handlers
  const url = request.nextUrl.clone();
  url.pathname = '/';
  const response = NextResponse.redirect(url);
  response.cookies.delete('admin_auth');
  return response;
}
