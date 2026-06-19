'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function BookModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '', reason: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      setStatus('Appointment request sent successfully!');
      setTimeout(() => {
        setStatus('');
        onClose();
      }, 2000);
    } else {
      setStatus('Error submitting request.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" 
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-slate-100" 
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-primary mb-6 tracking-tight">Book an Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Full Name</label>
                <input type="text" placeholder="Your Full Name" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 bg-slate-50" onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Phone Number</label>
                <input type="tel" placeholder="Your Contact Number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 bg-slate-50" onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Preferred Date</label>
                  <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 bg-slate-50" onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Preferred Time Slot</label>
                  <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 bg-slate-50" onChange={e => setFormData({...formData, time: e.target.value})}>
                    <option value="">Select Slot</option>
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Evening (5 PM - 10 PM)">Evening (5 PM - 10 PM)</option>
                    <option value="Sunday (9 AM - 2 PM)">Sunday (9 AM - 2 PM)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Reason for Visit</label>
                <textarea placeholder="Tell us briefly about your concerns (optional)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 bg-slate-50 h-28 resize-none" onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-light shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200">
                Confirm Booking Request
              </button>
              {status && <p className="text-center font-semibold text-primary text-sm mt-3">{status}</p>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
