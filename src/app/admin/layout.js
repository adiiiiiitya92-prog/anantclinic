'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, LogOut, Menu, X, Activity } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Appointments', href: '/admin', icon: LayoutDashboard },
    { name: 'Site Content', href: '/admin/content', icon: FileText },
  ];

  return (
    <div className="min-h-screen lg:h-screen bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-secondary" />
          <span className="font-bold text-lg tracking-wide">Anant Clinic Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 hover:bg-slate-800 rounded">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between lg:block">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-7 h-7 text-secondary" />
              <h2 className="text-xl font-extrabold text-white tracking-wide">Anant Clinic</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Admin Dashboard</p>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action="/api/auth/logout" method="POST">
            <button 
              type="submit" 
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden">
        <div className="flex-1 lg:overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
