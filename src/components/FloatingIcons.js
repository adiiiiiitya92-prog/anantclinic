'use client';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export default function FloatingIcons() {
  return (
    <div className="fixed bottom-6 z-50 left-6 right-6 pointer-events-none flex justify-between">
      <motion.a 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        href="tel:7385260597" 
        className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full bg-primary hover:bg-primary-light text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-colors duration-300"
      >
        <Phone className="w-6 h-6" />
      </motion.a>
      <motion.a 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}
        href="https://wa.me/917385260597" target="_blank" rel="noopener noreferrer" 
        className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-colors duration-300"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width={28} height={28} />
      </motion.a>
    </div>
  );
}
