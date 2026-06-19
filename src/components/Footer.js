import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Anant Clinic</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            The leading Skin & Piles Relief Center in Wadi, Nagpur. Guided by Ayurvedic heritage and modern excellence under Dr. Om Dwivedi.
          </p>
          {/* Social Media Links */}
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://www.instagram.com/anant_clinic_piles_relief_cent?igsh=b2treHJvMjR5ZnZ3" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-secondary text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md border border-slate-700/50 hover:border-transparent"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
            <li><Link href="#about" className="hover:text-secondary transition-colors">About Us</Link></li>
            <li><Link href="#treatments" className="hover:text-secondary transition-colors">Treatments</Link></li>
            <li><Link href="#gallery" className="hover:text-secondary transition-colors">Gallery</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-secondary">📍</span>
              <span>Plot no 102, Gajanan Society, Guruprasad Nagar, Duttawadi, Nagpur, Wadi, Maharashtra 440023</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-secondary">📞</span>
              <a href="tel:7385260597" className="hover:text-white transition-colors">7385260597</a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-secondary">✉️</span>
              <a href="mailto:dwivediom04575@gmail.com" className="hover:text-white transition-colors">dwivediom04575@gmail.com</a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Clinic Timings</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><strong className="text-slate-300">Mon - Sat:</strong> 9:00 AM - 12:00 PM</li>
            <li><strong className="text-slate-300">Mon - Sat:</strong> 5:00 PM - 10:00 PM</li>
            <li><strong className="text-slate-300">Sunday:</strong> 9:00 AM - 2:00 PM</li>
            <li className="pt-2">
              <a 
                href="https://www.instagram.com/anant_clinic_piles_relief_cent?igsh=b2treHJvMjR5ZnZ3" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>Follow on Instagram</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 bg-slate-950 py-6 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Anant Skin & Piles Relief Center. All rights reserved.</p>
          <p className="text-slate-500">
            Designed &amp; Developed by{' '}
            <span className="text-slate-400 font-medium">Setu Solution</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
