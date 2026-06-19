'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, Stethoscope, Activity, ArrowRight, Calendar, Star, ChevronDown, ChevronUp, Droplet, Flame, Scissors, Pill, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { treatments } from '@/lib/treatmentsData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingIcons from '@/components/FloatingIcons';
import BookModal from '@/components/BookModal';

export default function Home({ siteContent, reviews }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', email: '' });
  const [callbackStatus, setCallbackStatus] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Motion variants for consistent animations
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    setCallbackStatus('Submitting...');
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(callbackData)
    });
    const data = await res.json();
    if (data.success) {
      setCallbackStatus('Callback requested! We will call you shortly.');
      setCallbackData({ name: '', phone: '', email: '' });
      setTimeout(() => setCallbackStatus(''), 4000);
    } else {
      setCallbackStatus('Error submitting request.');
    }
  };

    // Treatments array is now imported from @/lib/treatmentsData

  const categories = ['All', ...Array.from(new Set(treatments.map(t => t.category)))];
  
  const categoryIcons = {
    "All": Sparkles,
    "Anorectal": Flame,
    "General medicine": Pill,
    "Surgery": Scissors,
    "Dermatology": Droplet,
    "Ayurveda Special": Leaf,
    "Pain Management": Activity,
    "Lifestyle": Heart
  };

  const filteredTreatments = activeCategory === 'All' 
    ? treatments 
    : treatments.filter(t => t.category === activeCategory);

  const faqs = [
    {
      q: "What is the best treatment for Piles in Nagpur?",
      a: "At Anant Clinic, Wadi, Nagpur, Dr. Om Dwivedi offers highly advanced, minimally invasive Ayurvedic and integrated treatments for Piles, Fissure, and Fistula, providing quick relief with minimal recurrence rate."
    },
    {
      q: "Can chronic skin diseases like Eczema or Psoriasis be cured?",
      a: "Yes, our specialized Ayurvedic treatments and modern diagnostics target the root causes of skin diseases (blood impurities, gut health) to provide long-lasting and permanent healing."
    },
    {
      q: "Where is Anant Clinic located and how can I book an appointment?",
      a: "We are located at Plot no 102, Gajanan Society, Guruprasad Nagar, Duttawadi, Nagpur (Wadi). You can book an appointment using our online booking form or via the call options."
    },
    {
      q: "What are the clinic timings?",
      a: "The clinic is open Monday to Saturday from 9:00 AM - 12:00 PM and 5:00 PM - 10:00 PM. On Sundays, the timings are 9:00 AM - 2:00 PM."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />

      {/* Redesigned Hero Section inspired by reference layout */}
      <section className="relative overflow-hidden bg-slate-50 py-16 lg:py-24 border-b border-slate-100 min-h-[600px] lg:min-h-[700px] flex items-center">
        {/* Full-width Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image 
            src="/assets/image copy 4.png" 
            alt="Dr. Om Dwivedi at Anant Clinic Nagpur" 
            fill 
            priority
            className="object-cover object-[78%_center] lg:object-right scale-[1.15] translate-x-[-3%] translate-y-[6%]" 
          />
        </div>

        {/* Gradient Overlay for Text Readability: Low transparency on the left (solid), fading to transparent on the right */}
        {/* Mobile overlay has lower opacity (75%) and subtle blur to show background image more clearly */}
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[1.5px] sm:bg-white/70 lg:backdrop-blur-none lg:bg-transparent lg:bg-[linear-gradient(to_right,#f8fafc_25%,rgba(248,250,252,0.95)_35%,rgba(248,250,252,0.6)_48%,rgba(248,250,252,0)_60%)] z-10"></div>
        
        {/* Decorative elements for premium feel */}
        <div className="absolute top-12 left-12 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none z-10 hidden lg:block"></div>
        <div className="absolute bottom-12 left-1/3 w-72 h-72 rounded-full bg-secondary/5 blur-3xl pointer-events-none z-10 hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Premium Clinic Introduction */}
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="lg:col-span-8 space-y-6 text-left max-w-3xl"
            >

              <motion.div variants={fadeUp} className="space-y-2">
                <h1 className="text-5xl sm:text-6xl lg:text-7.5xl font-black text-slate-900 tracking-tight leading-tight">
                  {siteContent.doctor_name}
                </h1>
                
                <h4 className="text-lg sm:text-xl font-bold text-primary-light">
                  {siteContent.doctor_qualifications}
                </h4>
              </motion.div>
              
              <motion.p variants={fadeUp} className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl whitespace-pre-wrap">
                {siteContent.doctor_bio}
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#treatments" 
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold border-2 border-secondary text-secondary hover:bg-secondary/5 transition-all duration-300"
                >
                  View Treatments <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold bg-secondary hover:bg-secondary-hover text-white shadow-xl shadow-secondary/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <Calendar className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Book Appointment</span>
                </button>
              </motion.div>



            </motion.div>

            {/* Right Column: Spacer to let the background image (Dr. Om Dwivedi) show through */}
            <div className="lg:col-span-4 hidden lg:block h-[350px] pointer-events-none"></div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-secondary/80 flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" /> Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">The Best Skin & Piles Care in Nagpur</h2>
          <p className="text-slate-600 text-lg">Combining authentic Ayurvedic remedies with advanced modern wellness principles.</p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-primary/5 group-hover:bg-primary/10 transition-colors rounded-2xl flex items-center justify-center text-primary mb-6">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Holistic Healing</h3>
            <p className="text-slate-600 leading-relaxed">
              We focus on diagnosing the core root of illnesses instead of suppressing superficial symptoms, using specialized herbal therapies.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-secondary/5 group-hover:bg-secondary/10 transition-colors rounded-2xl flex items-center justify-center text-secondary mb-6">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Dermatology Excellence</h3>
            <p className="text-slate-600 leading-relaxed">
              Dr. Om Dwivedi offers highly acclaimed procedures and medicines to cure eczema, psoriasis, acne, and other persistent skin conditions.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-primary/5 group-hover:bg-primary/10 transition-colors rounded-2xl flex items-center justify-center text-primary mb-6">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Anorectal Specialists</h3>
            <p className="text-slate-600 leading-relaxed">
              Permanent relief from painful piles, acute fissures, and complex fistulas without undergoing painful classical surgeries.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* About Doctor Section */}
      <section id="about" className="py-24 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image src="/assets/image copy 3.png" alt="Dr. Om Dwivedi" width={500} height={500} className="w-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="lg:col-span-7 space-y-6"
          >
            <motion.span variants={fadeUp} className="text-sm font-bold uppercase tracking-widest text-secondary/80 flex items-center gap-2">
              <Star className="w-4 h-4" /> Expert Care
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary leading-tight">Meet {siteContent.doctor_name}</motion.h2>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 text-sm text-slate-600 font-semibold mb-4">
              <span className="px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">B.A.M.S</span>
              <span className="px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">CSD</span>
              <span className="px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">Ayurveda Practitioner</span>
              <span className="px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">General Physician</span>
            </motion.div>
            <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed text-lg">
              Dr. Om Dwivedi is a highly dedicated Ayurvedic physician and skin care specialist serving Duttawadi, Nagpur and Wadi areas. Combining traditional diagnostic methods with absolute clinical precision, he treats root-cause problems rather than basic symptoms.
            </motion.p>
            <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed text-lg">
              Over the years, Dr. Dwivedi has developed an exemplary reputation for successfully handling complicated skin diseases and critical anorectal conditions (piles, fissure, fistula) that have failed to respond to other treatment models.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-6">
              <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-full shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1">
                Schedule a Consultation
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Treatments Tabs & Grid Section */}
      <section id="treatments" className="py-24 relative overflow-hidden bg-white border-b border-slate-100">
        {/* Subtle Background decoration */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
           <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-12 space-y-3"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-secondary/80 font-mono flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" /> Medical Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">Our Treatments & Specializations</h2>
            <p className="text-slate-600 text-lg">Find absolute remedies for specialized anorectal conditions, skin problems, and lifestyle diseases.</p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((cat, idx) => {
              const Icon = categoryIcons[cat] || Activity;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-sm ${
                    isActive 
                      ? 'bg-primary text-white shadow-primary/20 scale-105' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary'}`} />
                  {cat}
                </button>
              );
            })}
          </motion.div>

          {/* Treatments Grid */}
          <motion.div 
            key={activeCategory} // Forces re-animation when category changes
            initial="hidden" animate="visible" variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredTreatments.map((t, idx) => {
              const Icon = categoryIcons[t.category] || Activity;
              return (
                <motion.div 
                  variants={fadeUp} 
                  key={t.name} 
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-2 group flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative background icon */}
                  <Icon className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-50 group-hover:text-primary/5 transition-colors duration-500 pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="w-12 h-12 bg-primary/5 group-hover:bg-primary text-primary group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300">
                       <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 mb-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                        {t.category}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors leading-snug">
                        {t.name}
                      </h4>
                    </div>
                  </div>
                  
                  <Link href={`/treatments/${t.slug}`} className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-secondary/80 group-hover:text-secondary transition-colors relative z-10">
                    <span>Explore Treatment</span>
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Subtle background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16 space-y-3"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-secondary/80 font-mono flex items-center justify-center gap-2">
              <Star className="w-4 h-4" /> Patient Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">What Our Patients Say</h2>
            <p className="text-slate-400 text-lg">Read genuine patient testimonials praising the success of our piles and skin care programs.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {reviews.map((review, idx) => (
              <motion.div key={review.id || idx} variants={fadeUp} className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 hover:border-slate-600 transition-colors relative space-y-4 shadow-xl">
                <span className="text-5xl text-secondary absolute top-4 right-6 font-serif opacity-20">“</span>
                <div className="flex text-yellow-400 gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400' : 'text-slate-600'}`} />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  &quot;{review.content}&quot;
                </p>
                <h5 className="font-bold text-white flex items-center gap-2 mt-4">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                    {review.initials}
                  </div> 
                  {review.patientName}
                </h5>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary font-mono">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-primary hover:text-primary-light transition-colors">
                <span>{faq.q}</span>
                <span className="text-xl text-slate-400">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-sm text-slate-650 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Clinic Gallery */}
      <section id="gallery" className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary font-mono">Visuals</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">Our Clinic Gallery</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-200 bg-white group">
              <Image src="/assets/image.png" alt="Anant Clinic Board" width={400} height={300} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-350" />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-200 bg-white group">
              <Image src="/assets/image copy 2.png" alt="Anant Clinic Reference Diagram" width={400} height={300} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-350" />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-200 bg-white group">
              <Image src="/assets/image copy.png" alt="Anant Clinic Prescription pad details" width={400} height={300} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-350" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact and Map Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">Visit Us</span>
              <h2 className="text-3xl font-extrabold text-primary leading-tight">Anant Skin & Piles Relief Center</h2>
              <p className="text-slate-650">Visit us directly at our Nagpur clinic. You can use the map on the right to navigate.</p>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex gap-3">
                <span className="text-lg">📍</span>
                <span>Plot no 102, Gajanan Society, Guruprasad Nagar, Duttawadi, Nagpur, Wadi, Maharashtra 440023</span>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">📞</span>
                <a href={`tel:${siteContent.clinic_phone}`} className="hover:text-primary font-bold">{siteContent.clinic_phone}</a>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">✉️</span>
                <a href={`mailto:${siteContent.clinic_email}`} className="hover:text-primary font-bold">{siteContent.clinic_email}</a>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <h4 className="font-bold text-primary mb-2">Clinic Hours</h4>
              <ul className="space-y-1.5 text-sm text-slate-650">
                <li><strong>Mon - Sat (Morning):</strong> 9:00 AM - 12:00 PM</li>
                <li><strong>Mon - Sat (Evening):</strong> 5:00 PM - 10:00 PM</li>
                <li><strong>Sunday:</strong> 9:00 AM - 2:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 h-96 lg:h-auto min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.261972846879!2d78.9959553!3d21.141975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd495444a4f8285%3A0xc3f837367c30165e!2sPlot%20no%20102%2C%20Gajanan%20Society%2C%20Guruprasad%20Nagar%2C%20Duttawadi%2C%20Nagpur%2C%20Wadi%2C%20Maharashtra%20440023!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingIcons />
      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
