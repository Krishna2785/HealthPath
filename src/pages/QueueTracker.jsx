import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, User, Clock, Activity, MapPin, ArrowLeft } from 'lucide-react';
// Note: no backend endpoint exists for real-time queue position.
// A live queue API would need WebSocket support or polling — left as future work.

export default function QueueTracker() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor');
  
  const [queuePosition, setQueuePosition] = useState(4);
  const [eta, setEta] = useState(45); // minutes

  // Simulate queue moving
  useEffect(() => {
    const interval = setInterval(() => {
      setQueuePosition(prev => {
        if (prev > 1) {
          setEta(e => Math.max(0, e - 15));
          return prev - 1;
        }
        return prev;
      });
    }, 15000); // Queue moves every 15 seconds for demo

    return () => clearInterval(interval);
  }, []);

  // doctorId could be used to fetch doctor info from the API in a future enhancement.
  // For now we show a generic label since no GET /api/doctors/:id endpoint exists.
  const doctor = { name: 'Your Doctor', speciality: 'Specialist' };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Booking Confirmed</h1>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointment Booked!</h2>
          <p className="text-slate-600">Your booking ID is <span className="font-mono font-bold text-slate-800">{bookingId}</span></p>
        </div>

        {/* Live Queue Tracker */}
        <div className="bg-white border border-slate-200 shadow-lg shadow-blue-500/5 rounded-3xl overflow-hidden mb-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <div className="h-full bg-blue-600 animate-pulse" style={{ width: '100%' }}></div>
          </div>
          
          <div className="p-8 text-center border-b border-slate-100">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Activity size={16} className="animate-pulse" /> Live Queue Status
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Position</span>
                <div className="text-7xl font-black text-slate-800 tracking-tighter">
                  #{queuePosition}
                </div>
                <span className="text-slate-500 font-medium mt-2">in line</span>
              </div>
              
              <div className="hidden md:block w-px h-24 bg-slate-200"></div>
              
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Estimated Wait</span>
                <div className="text-5xl font-black text-blue-600 tracking-tighter flex items-center gap-2">
                  <Clock size={40} className="text-blue-600/50" /> {eta}
                </div>
                <span className="text-slate-500 font-medium mt-2">minutes</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800">{doctor.name}</p>
                <p className="text-sm text-slate-500 font-medium">{doctor.speciality}</p>
              </div>
            </div>
            <button className="text-blue-600 font-semibold hover:underline">Get Directions</button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">What to do next?</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-slate-600">
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <p>Keep this page open to track your live queue status.</p>
            </li>
            <li className="flex gap-3 text-slate-600">
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <p>Aim to reach the hospital when your estimated wait time is around 15 minutes.</p>
            </li>
            <li className="flex gap-3 text-slate-600">
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
              <p>Show your booking ID <span className="font-mono font-bold text-slate-800">{bookingId}</span> at the reception upon arrival.</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
