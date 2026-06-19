import { db } from '@/lib/firebase';
import ContentForm from './ContentForm';
import ReviewsManager from './ReviewsManager';
import { LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContentPage() {
  // Default values
  const defaultContent = {
    doctor_name: "Dr. Om Dwivedi",
    doctor_qualifications: "B.A.M.S, CSD (Ayurveda & Skin Specialist)",
    doctor_bio: "Dr. Om Dwivedi stands at the forefront of Ayurvedic medicine and skin care in Nagpur, leading with a profound commitment to painless healing and medical excellence.",
    clinic_phone: "7385260597",
    clinic_email: "dwivediom04575@gmail.com",
  };

  // Fetch site content from Firestore
  let contentMap = {};
  try {
    const doc = await db.collection('site').doc('content').get();
    if (doc.exists) {
      contentMap = doc.data();
    } else {
      // Seed default content in Firestore
      await db.collection('site').doc('content').set(defaultContent);
      contentMap = defaultContent;
    }
  } catch (error) {
    console.error("Firestore content fetch/seed error:", error);
  }

  // Merge loaded database fields with defaults
  const finalContent = { ...defaultContent, ...contentMap };

  // Fetch reviews from Firestore
  let reviews = [];
  try {
    const snap = await db.collection('reviews').orderBy('createdAt', 'desc').get();
    reviews = snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        patientName: data.patientName || '',
        initials: data.initials || '',
        content: data.content || '',
        rating: data.rating || 5,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
      };
    });
  } catch (error) {
    console.error("Firestore reviews fetch error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Site Content Management</h1>
          <p className="text-slate-500 mt-2">Edit the text shown on your main website here.</p>
        </div>
        
        {/* Logout Button */}
        <form action="/api/auth/logout" method="POST" className="w-full sm:w-auto">
          <button type="submit" className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors shadow-sm border border-red-200 cursor-pointer">
            <LogOut className="w-4 h-4" />
            Secure Logout
          </button>
        </form>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
        <ContentForm initialData={finalContent} />
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mt-8">
        <ReviewsManager reviews={reviews} />
      </div>
    </div>
  );
}
