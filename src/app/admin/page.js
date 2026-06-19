import { db } from '@/lib/firebase';
import AppointmentsDashboard from './AppointmentsDashboard';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
  let appointments = [];
  try {
    const snap = await db.collection('appointments').orderBy('createdAt', 'desc').get();
    appointments = snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        phone: data.phone || '',
        date: data.date || '',
        time: data.time || '',
        reason: data.reason || '',
        status: data.status || 'PENDING',
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
      };
    });
  } catch (error) {
    console.error("Firestore appointments fetch error:", error);
  }

  return <AppointmentsDashboard initialAppointments={appointments} />;
}
