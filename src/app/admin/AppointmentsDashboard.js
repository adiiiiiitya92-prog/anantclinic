'use client';

import { useState, useTransition } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Phone, 
  Filter, 
  X, 
  Check, 
  AlertCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { updateAppointmentStatus, deleteAppointment } from './actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppointmentsDashboard({ initialAppointments }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'completed' | 'all'
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState(null);
  
  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to format date cleanly
  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // Fallback if not standard date string
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to get today's date in local YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return `${yyyy}-${mm}-${dd}`;
  };
  const todayStr = getTodayString();

  // Statistics Calculation
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    completedToday: appointments.filter(a => a.status === 'COMPLETED' && a.date === todayStr).length,
    allCompleted: appointments.filter(a => a.status === 'COMPLETED').length,
  };

  // Toggle status handler with optimistic update
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    setUpdatingId(id);

    // Save previous state for rollback
    const previousAppointments = [...appointments];

    // Optimistically update UI
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: nextStatus } : app
    ));

    startTransition(async () => {
      const result = await updateAppointmentStatus(id, nextStatus);
      if (result.success) {
        showToast(
          `Appointment marked as ${nextStatus === 'COMPLETED' ? 'completed' : 'pending'}.`,
          'success'
        );
      } else {
        // Rollback
        setAppointments(previousAppointments);
        showToast(result.error || 'Failed to update appointment status.', 'error');
      }
      setUpdatingId(null);
    });
  };

  // Cancel handler
  const handleCancelAppointment = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    setUpdatingId(id);
    const previousAppointments = [...appointments];

    // Optimistically cancel
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'CANCELLED' } : app
    ));

    startTransition(async () => {
      const result = await updateAppointmentStatus(id, 'CANCELLED');
      if (result.success) {
        showToast('Appointment successfully cancelled.', 'info');
      } else {
        setAppointments(previousAppointments);
        showToast(result.error || 'Failed to cancel appointment.', 'error');
      }
      setUpdatingId(null);
    });
  };

  // Delete handler
  const handleDeleteAppointment = async (id) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this appointment record? This action cannot be undone.')) {
      return;
    }

    setUpdatingId(id);
    const previousAppointments = [...appointments];

    // Optimistically delete
    setAppointments(prev => prev.filter(app => app.id !== id));

    startTransition(async () => {
      const result = await deleteAppointment(id);
      if (result.success) {
        showToast('Appointment record permanently deleted.', 'success');
      } else {
        setAppointments(previousAppointments);
        showToast(result.error || 'Failed to delete appointment.', 'error');
      }
      setUpdatingId(null);
    });
  };

  // Filtering Logic
  const filteredAppointments = appointments.filter(app => {
    // Name or phone matches
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);

    // Date matches if filtered
    const matchesDate = filterDate ? app.date === filterDate : true;

    // Tab category matches
    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = app.status === 'PENDING';
    } else if (activeTab === 'completed') {
      matchesTab = app.status === 'COMPLETED' || app.status === 'CANCELLED';
    } // 'all' matches everything

    return matchesSearch && matchesDate && matchesTab;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterDate('');
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${
              toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' :
              toast.type === 'error' ? 'bg-rose-50/90 border-rose-200 text-rose-800' :
              'bg-slate-50/90 border-slate-200 text-slate-800'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
             toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-600" /> :
             <AlertCircle className="w-5 h-5 text-slate-600" />}
            <span className="font-semibold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:bg-black/5 p-1 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            Appointments Dashboard
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and track your patient visits and treatment schedules.</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Active Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Requests</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight group-hover:text-primary transition-colors">
                {stats.pending}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Awaiting doctor check-in</span>
          </div>
        </div>

        {/* Stat 2: Completed Today */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Today</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight group-hover:text-primary transition-colors">
                {stats.completedToday}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            <span>Visits completed on {formatDateString(todayStr)}</span>
          </div>
        </div>

        {/* Stat 3: All-Time Completed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Completed</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight group-hover:text-primary transition-colors">
                {stats.allCompleted}
              </h3>
            </div>
            <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Check className="w-3.5 h-3.5" />
            <span>Success rate of overall visits</span>
          </div>
        </div>

        {/* Stat 4: Total Bookings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight group-hover:text-primary transition-colors">
                {stats.total}
              </h3>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Cumulative database entries</span>
          </div>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto max-w-full p-1 bg-slate-50 rounded-xl w-full lg:w-fit gap-1 scrollbar-none snap-x snap-mandatory">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shrink-0 snap-start ${
                activeTab === 'pending'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              Active Requests
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'pending' ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'
              }`}>
                {stats.pending}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shrink-0 snap-start ${
                activeTab === 'completed'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              History
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'completed' ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'
              }`}>
                {appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shrink-0 snap-start ${
                activeTab === 'all'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Filter className="w-4 h-4" />
              All Bookings
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'all' ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'
              }`}>
                {stats.total}
              </span>
            </button>
          </div>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search patient or phone..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium placeholder-slate-400 text-slate-800 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Date Input */}
            <div className="relative flex-1 sm:w-44">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-800 transition-all"
              />
            </div>

            {/* Reset Filters */}
            {(searchTerm || filterDate) && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors text-sm font-bold flex items-center justify-center gap-1.5"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 w-12 text-center">Done</th>
                <th className="px-6 py-4 font-bold">Patient Details</th>
                <th className="px-6 py-4 font-bold">Schedule</th>
                <th className="px-6 py-4 font-bold">Reason</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center max-w-xs mx-auto space-y-3">
                        <div className="p-4 bg-slate-50 rounded-full text-slate-400">
                          <Filter className="w-8 h-8" />
                        </div>
                        <p className="font-semibold text-slate-800">No appointments found</p>
                        <p className="text-xs text-slate-400">Try modifying your search or date query parameters.</p>
                        {(searchTerm || filterDate) && (
                          <button
                            onClick={handleResetFilters}
                            className="text-xs text-primary font-bold hover:underline"
                          >
                            Reset filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : filteredAppointments.map(app => (
                  <tr 
                    key={app.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${
                      updatingId === app.id ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {/* Checkbox status marker */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(app.id, app.status)}
                        disabled={app.status === 'CANCELLED'}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          app.status === 'COMPLETED' 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                            : app.status === 'CANCELLED'
                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                            : 'border-slate-300 bg-white hover:border-primary'
                        }`}
                        title={app.status === 'COMPLETED' ? "Mark Pending" : "Mark Completed"}
                      >
                        {app.status === 'COMPLETED' && <Check className="w-4 h-4 stroke-[3px]" />}
                      </button>
                    </td>

                    {/* Patient detail */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-base">{app.name}</span>
                        <a 
                          href={`tel:${app.phone}`} 
                          className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          {app.phone}
                        </a>
                      </div>
                    </td>

                    {/* Date and Time */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 text-sm">{formatDateString(app.date)}</span>
                        <span className="text-xs text-slate-400 font-medium mt-0.5">{app.time}</span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={app.reason || 'General checkup'}>
                      <span className="font-medium">{app.reason || <em className="text-slate-400">General consultation</em>}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                        app.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        app.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          app.status === 'PENDING' ? 'bg-amber-500' : 
                          app.status === 'COMPLETED' ? 'bg-emerald-500' : 
                          'bg-rose-500'
                        }`} />
                        {app.status === 'PENDING' ? 'Pending' : 
                         app.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-2">
                      {app.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Cancel Appointment"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAppointment(app.id)}
                        className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredAppointments.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500 space-y-2">
              <Filter className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-800">No appointments found</p>
              <p className="text-xs text-slate-400">Clear filters to display all bookings.</p>
            </div>
          ) : filteredAppointments.map(app => (
            <div 
              key={app.id} 
              className={`p-5 space-y-4 transition-opacity ${
                updatingId === app.id ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                {/* Details */}
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">{app.name}</h4>
                  <a href={`tel:${app.phone}`} className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {app.phone}
                  </a>
                </div>

                {/* Mobile Checkbox Toggler */}
                <button
                  onClick={() => handleToggleStatus(app.id, app.status)}
                  disabled={app.status === 'CANCELLED'}
                  className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                    app.status === 'COMPLETED' 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                      : app.status === 'CANCELLED'
                      ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                      : 'border-slate-300 bg-white hover:border-primary'
                  }`}
                >
                  {app.status === 'COMPLETED' && <Check className="w-4 h-4 stroke-[3px]" />}
                </button>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-600">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Date & Time</p>
                  <p className="text-slate-800 mt-0.5">{formatDateString(app.date)}</p>
                  <p className="text-slate-500 mt-0.5 font-medium">{app.time}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full mt-1 border ${
                    app.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    app.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {app.status === 'PENDING' ? 'Pending' : 
                     app.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div className="text-sm">
                <span className="text-slate-400 font-semibold text-xs">Reason: </span>
                <span className="text-slate-700 font-medium">{app.reason || <em className="text-slate-400">None provided</em>}</span>
              </div>

              {/* Mobile Actions Bar */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                {app.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelAppointment(app.id)}
                    className="flex-1 max-w-[120px] py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAppointment(app.id)}
                  className="flex-1 max-w-[120px] py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
