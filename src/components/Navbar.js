'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import BookModal from './BookModal';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200/50 py-1' : 'bg-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-1 border border-slate-100 transition-transform duration-300 group-hover:scale-105">
              <Image src="/assets/logo anant.png" alt="Anant Clinic Logo" width={32} height={32} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-lg tracking-tight text-primary leading-none">Anant Clinic</span>
              <span className="font-sans text-[10px] font-bold text-secondary tracking-widest uppercase mt-0.5">& Piles Relief Center</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 shadow-sm">
            <Link href="/" className="font-sans text-sm font-bold text-slate-700 hover:text-primary transition-colors duration-200">Home</Link>
            <Link href="/#about" className="font-sans text-sm font-bold text-slate-700 hover:text-primary transition-colors duration-200">About</Link>
            <Link href="/#treatments" className="font-sans text-sm font-bold text-slate-700 hover:text-primary transition-colors duration-200">Treatments</Link>
            <Link href="/#gallery" className="font-sans text-sm font-bold text-slate-700 hover:text-primary transition-colors duration-200">Gallery</Link>
            <Link href="/#reviews" className="font-sans text-sm font-bold text-slate-700 hover:text-primary transition-colors duration-200">Reviews</Link>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary-light shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            Book Appointment
          </button>
        </div>
      </motion.nav>
      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
