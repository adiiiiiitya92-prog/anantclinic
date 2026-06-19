'use client';

import { useState } from 'react';
import { updateContent } from './actions';
import { Save, User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

export default function ContentForm({ initialData }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    
    const formData = new FormData(e.target);
    const result = await updateContent(formData);
    
    setIsSaving(false);
    if (result.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Doctor Details Section */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Doctor Details
            </h3>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="doctor_name" className="block text-sm font-bold text-slate-700">Doctor's Name</label>
            <input 
              type="text" 
              id="doctor_name" 
              name="doctor_name" 
              defaultValue={initialData.doctor_name}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="doctor_qualifications" className="block text-sm font-bold text-slate-700">Qualifications & Subtitle</label>
            <input 
              type="text" 
              id="doctor_qualifications" 
              name="doctor_qualifications" 
              defaultValue={initialData.doctor_qualifications}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="doctor_bio" className="block text-sm font-bold text-slate-700">Doctor's Bio (Hero Section)</label>
            <textarea 
              id="doctor_bio" 
              name="doctor_bio" 
              rows="4"
              defaultValue={initialData.doctor_bio}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 resize-y"
              required
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Phone className="w-5 h-5 text-secondary" /> Contact Information
            </h3>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="clinic_phone" className="block text-sm font-bold text-slate-700">Clinic Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                id="clinic_phone" 
                name="clinic_phone" 
                defaultValue={initialData.clinic_phone}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors bg-slate-50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="clinic_email" className="block text-sm font-bold text-slate-700">Clinic Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                id="clinic_email" 
                name="clinic_email" 
                defaultValue={initialData.clinic_email}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors bg-slate-50"
                required
              />
            </div>
          </div>
        </div>

      </div>

      <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
        <div>
          {saveStatus === 'success' && (
            <p className="text-green-600 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-5 h-5" /> Successfully saved to database!
            </p>
          )}
          {saveStatus === 'error' && (
            <p className="text-red-500 font-bold">Error saving content. Please try again.</p>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-light text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
