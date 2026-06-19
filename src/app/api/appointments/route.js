import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(request) {
  try {
    const { name, phone, date, time, reason } = await request.json();
    
    const docRef = await db.collection('appointments').add({
      name,
      phone,
      date,
      time,
      reason: reason || '',
      status: 'PENDING',
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
