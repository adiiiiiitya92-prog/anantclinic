import { getTreatmentBySlug, treatments } from '@/lib/treatmentsData';
import { notFound } from 'next/navigation';
import TreatmentClient from './TreatmentClient';

// Generate static params for all treatments so they can be statically generated (optional but good for performance)
export function generateStaticParams() {
  return treatments.map((t) => ({
    slug: t.slug,
  }));
}

// Dynamically generate SEO metadata based on the treatment
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const treatment = getTreatmentBySlug(resolvedParams.slug);
  
  if (!treatment) {
    return { title: 'Treatment Not Found' };
  }

  return {
    title: `${treatment.name} Treatment in Nagpur | Dr. Om Dwivedi | Anant Clinic`,
    description: treatment.shortDescription,
    keywords: `${treatment.name}, ${treatment.category}, treatment in Nagpur, Dr. Om Dwivedi, Anant Clinic Wadi`,
    openGraph: {
      title: `${treatment.name} Treatment - Anant Clinic`,
      description: treatment.shortDescription,
      url: `https://anantclinic.com/treatments/${treatment.slug}`,
      siteName: 'Anant Clinic',
      type: 'website',
    },
  };
}

export default async function TreatmentPage({ params }) {
  const resolvedParams = await params;
  const treatment = getTreatmentBySlug(resolvedParams.slug);

  if (!treatment) {
    notFound();
  }

  return <TreatmentClient treatment={treatment} />;
}
