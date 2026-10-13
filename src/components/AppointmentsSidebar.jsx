import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Stethoscope, Building2, CheckCircle2, AlertCircle, ChevronRight, ClipboardList, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

const statusConfig = {
  Confirmed: {
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  Pending: {
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    dot: 'bg-amber-500',
    icon: AlertCircle,
  },
  Cancelled: {
    color: 'text-red-700 bg-red-50 border-red-200',
    dot: 'bg-red-500',
    icon: X,
  },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AppointmentsSidebar({ isOpen, onClose }) {
  const { authFetch, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      authFetch(`${API_BASE_URL}/api/appointments/my`)
        .then(res => res.json())
        .then(data => {
          setAppointments(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Panel */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <ClipboardList size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">My Appointments</h2>
              <p className="text-blue-200 text-xs font-medium">{user?.name || 'Demo'}'s bookings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-colors p-2 rounded-xl"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
              <Loader2 size={36} className="animate-spin text-blue-500" />
              <p className="font-medium">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                <Calendar size={40} className="text-blue-300" />
              </div>
              <div>
                <h3 className="text-slate-700 font-bold text-lg mb-2">No Appointments Yet</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your booked appointments will appear here. Find a hospital and schedule a visit!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 pb-1">
                {appointments.length} Booking{appointments.length > 1 ? 's' : ''}
              </p>
              {appointments.map((appt, i) => {
                const cfg = statusConfig[appt.status] || statusConfig.Confirmed;
                const Icon = cfg.icon;
                return (
                  <div
                    key={appt.bookingId || i}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Status bar at top */}
                    <div className={`h-1 w-full ${cfg.dot}`} />
                    
                    <div className="p-4">
                      {/* Top row: booking ID + status badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 tracking-wider">
                          #{appt.bookingId}
                        </span>
                        <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {appt.status}
                        </span>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                          <Stethoscope size={22} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{appt.doctorName || 'Doctor'}</p>
                          <p className="text-xs text-blue-600 font-semibold truncate">{appt.speciality || ''}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm text-slate-500">
                        {appt.hospitalName && (
                          <div className="flex items-center gap-2">
                            <Building2 size={15} className="text-slate-400 shrink-0" />
                            <span className="truncate font-medium">{appt.hospitalName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-slate-400 shrink-0" />
                          <span className="font-medium">{appt.date || formatDate(appt.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={15} className="text-slate-400 shrink-0" />
                          <span className="font-medium">{appt.slot}</span>
                        </div>
                      </div>

                      {/* Patient */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">Patient: <span className="text-slate-600 font-bold">{appt.patientName}</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}
