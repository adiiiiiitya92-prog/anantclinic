import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { password } = body;

  // Hardcoded simple password for this prototype
  if (password === 'anant123') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
}
