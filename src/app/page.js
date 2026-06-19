import { db } from '@/lib/firebase';
import HomePageClient from './HomePageClient';

export const revalidate = 0; // Ensures the page fetches fresh content on demand

export default async function Home() {
  // Fetch site content from Firestore
  let contentMap = {};
  try {
    const siteContentDoc = await db.collection('site').doc('content').get();
    if (siteContentDoc.exists) {
      contentMap = siteContentDoc.data();
    }
  } catch (error) {
    console.error("Firestore site content fetch error:", error);
  }

  // Provide sensible defaults in case DB is empty
  const defaultContent = {
    doctor_name: "Dr. Om Dwivedi",
    doctor_qualifications: "B.A.M.S, CSD (Ayurveda & Skin Specialist)",
    doctor_bio: "Dr. Om Dwivedi stands at the forefront of Ayurvedic medicine and skin care in Nagpur, leading with a profound commitment to painless healing and medical excellence.",
    clinic_phone: "7385260597",
    clinic_email: "dwivediom04575@gmail.com",
  };

  // Merge DB content over defaults
  const finalContent = { ...defaultContent, ...contentMap };

  // Fetch reviews from Firestore
  let reviews = [];
  try {
    const reviewsSnap = await db.collection('reviews').orderBy('createdAt', 'desc').get();
    reviews = reviewsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        patientName: data.patientName,
        initials: data.initials,
        content: data.content,
        rating: data.rating,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
      };
    });
  } catch (error) {
    console.error("Firestore review fetch error:", error);
  }

  // Pre-seed default reviews if the DB is empty
  const defaultReviews = [
    { id: '1a', initials: 'RK', patientName: 'Rajesh Kumar', rating: 5, content: 'I was struggling with chronic piles for more than 5 years and consulted several doctors. The Ayurvedic treatment given by Dr. Om Dwivedi worked like magic! The pain stopped within days. Best doctor in Nagpur.' },
    { id: '2b', initials: 'SP', patientName: 'Sneha Patil', rating: 5, content: 'Excellent skin clinic. My eczema is completely cured now. The medicines are affordable and don\'t have side effects. Dr. Om Dwivedi is very professional and patient.' },
    { id: '3c', initials: 'AS', patientName: 'Amit Sharma', rating: 5, content: 'The clinic and staff are extremely helpful. Booking was smooth. Highly recommend for any chronic disease treatments using holistic methods.' },
  ];

  const finalReviews = reviews.length > 0 ? reviews : defaultReviews;

  return <HomePageClient siteContent={finalContent} reviews={finalReviews} />;
}
