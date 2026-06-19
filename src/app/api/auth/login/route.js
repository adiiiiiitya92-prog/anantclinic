import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: 'ID Token is required' }, 
        { status: 400 }
      );
    }

    // Verify token with Google identity toolkit REST API (lightweight and edge-friendly server call)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBa00zLQrvgCAq6i3sEdcTIpPvIZfpjhNE";
    const googleVerifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
    
    const verifyResponse = await fetch(googleVerifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      console.error('ID Token Verification Failed:', errorData);
      return NextResponse.json({ success: false, message: 'Invalid or expired session token' }, { status: 401 });
    }

    const verifyData = await verifyResponse.json();
    if (verifyData.users && verifyData.users[0]) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365, // Persistent for 1 year (365 days)
        path: '/',
      });
      return response;
    }
  } catch (error) {
    console.error('Firebase Auth Verification Error:', error);
    return NextResponse.json({ success: false, message: 'Internal authentication server error' }, { status: 500 });
  }

  return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 401 });
}
