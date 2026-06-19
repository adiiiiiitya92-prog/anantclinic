import { NextResponse } from 'next/server';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBa00zLQrvgCAq6i3sEdcTIpPvIZfpjhNE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "anantclinic-5ed24.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "anantclinic-5ed24",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "anantclinic-5ed24.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "455950112252",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:455950112252:web:9de8efad9bce7242a48e79"
};

// Ensure Firebase is initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Both email and password are required' }, 
        { status: 400 }
      );
    }

    // Authenticate using Firebase Authentication
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user) {
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
  } catch (error) {
    console.error('Firebase Auth Login Error:', error);
    
    let message = 'Invalid email or password';
    if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address format';
    } else if (error.code === 'auth/user-disabled') {
      message = 'This administrator account has been disabled';
    }
    
    return NextResponse.json({ success: false, message }, { status: 401 });
  }

  return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 401 });
}
