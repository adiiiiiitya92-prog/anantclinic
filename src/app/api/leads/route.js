import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(request) {
  try {
    const { name, email, phone } = await request.json();
    const docRef = await db.collection('leads').add({
      name,
      email: email || '',
      phone,
      status: 'NEW',
      createdAt: new Date()
    });
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
