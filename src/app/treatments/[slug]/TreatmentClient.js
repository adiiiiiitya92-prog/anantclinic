'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingIcons from '@/components/FloatingIcons';
import BookModal from '@/components/BookModal';
import { CheckCircle2, AlertCircle, ArrowRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TreatmentClient({ treatment }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                  {treatment.category}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {treatment.name} Treatment
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                {treatment.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-12">
              
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-slate-900">About the Condition & Treatment</h2>
                </div>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {treatment.description}
                </p>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <h2 className="text-3xl font-bold text-slate-900">Common Symptoms</h2>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <ul className="space-y-4">
                    {treatment.symptoms.map((symptom, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-1 w-2 h-2 rounded-full bg-red-400 shrink-0"></div>
                        <span className="text-slate-700 font-medium text-lg">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-secondary" />
                  <h2 className="text-3xl font-bold text-slate-900">Treatment Benefits</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {treatment.benefits.map((benefit, idx) => (
                    <div key={idx} className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10 flex items-center gap-4">
                      <CheckCircle2 className="w-6 h-6 text-secondary shrink-0" />
                      <span className="text-slate-800 font-bold">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Column: CTA Sidebar */}
            <div className="lg:col-span-1 sticky top-28">
              <div className="bg-primary p-8 rounded-3xl shadow-2xl text-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <h3 className="text-2xl font-bold relative z-10">Schedule Your Consultation</h3>
                <p className="text-primary-light text-sm leading-relaxed relative z-10">
                  Don't let {treatment.name} affect your quality of life. Book an appointment with Dr. Om Dwivedi today for an expert diagnosis and effective treatment plan.
                </p>
                
                <div className="pt-4 relative z-10">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full font-bold bg-secondary hover:bg-secondary-hover text-white shadow-xl shadow-secondary/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer w-full text-center"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Book Appointment</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-white/20 text-center relative z-10">
                  <span className="text-xs text-primary-light uppercase tracking-wider font-bold block mb-2">Or call us directly</span>
                  <a href="tel:7385260597" className="text-2xl font-bold hover:text-secondary transition-colors">
                    7385260597
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 flex items-center justify-center">
                 <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors">
                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Homepage
                 </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <FloatingIcons />
      
      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
