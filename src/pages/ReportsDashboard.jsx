import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, FileText, FlaskConical, MapPin, Calendar, Clock, Home, Building2, ArrowLeft } from 'lucide-react';

export default function ReportsDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'reports'

  // If accessed directly without booking state, use some dummy data for demo
  const booking = state || {
    bookingId: 'LAB-12345',
    lab: { name: 'Dr. Lal PathLabs', address: '12, Main Street, Near City Center' },
    visitType: 'center',
    cart: [
      { id: 't1', name: 'Complete Blood Count (CBC)', price: 350, turnaround: '24 Hours' }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-500 hover:text-purple-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">My Lab Bookings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
        
        {/* Success Banner (if coming from booking) */}
        {state && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-8 shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex shrink-0 items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Booking Confirmed!</h2>
              <p className="text-slate-600">Your tests have been scheduled. Booking ID: <strong className="font-mono text-slate-800">{booking.bookingId}</strong></p>
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-8">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-2 font-bold transition-all ${
              activeTab === 'upcoming' 
                ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upcoming Tests
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`pb-4 px-2 font-bold transition-all ${
              activeTab === 'reports' 
                ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Digital Reports
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'upcoming' ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Scheduled</span>
                    <span className="text-slate-400 font-mono text-sm">ID: {booking.bookingId}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{booking.lab.name}</h3>
                  <p className="text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={16} /> {booking.lab.address}
                  </p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3 min-w-[200px]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Calendar size={18} className="text-purple-600" /> Tomorrow
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock size={18} className="text-purple-600" /> 09:00 AM
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    {booking.visitType === 'home' ? (
                      <><Home size={18} className="text-purple-600" /> Home Sample</>
                    ) : (
                      <><Building2 size={18} className="text-purple-600" /> Center Visit</>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Tests Included ({booking.cart.length})</h4>
                {booking.cart.map(test => (
                  <div key={test.id} className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <FlaskConical size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{test.name}</p>
                        <p className="text-xs text-slate-500 font-medium">Turnaround: {test.turnaround}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">₹{test.price}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Total Paid:</span>
                <span className="text-2xl font-black text-slate-800">
                  ₹{booking.cart.reduce((s, t) => s + t.price, 0)}
                </span>
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mock previous reports */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Lipid Profile Report</h4>
                  <p className="text-sm text-slate-500">SRL Diagnostics • Oct 12, 2023</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-purple-600 font-bold bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center">
                <Download size={18} /> Download PDF
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Complete Blood Count (CBC)</h4>
                  <p className="text-sm text-slate-500">Dr. Lal PathLabs • Jul 04, 2023</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-purple-600 font-bold bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center">
                <Download size={18} /> Download PDF
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
