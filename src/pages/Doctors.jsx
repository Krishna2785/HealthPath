import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, CheckCircle2, Search, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Doctors() {
  const { hospitalId, specialityName } = useParams();
  const navigate = useNavigate();
  const { authFetch, user } = useAuth();
  
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    // Fetch Hospital
    fetch('http://localhost:5000/api/hospitals')
      .then(res => res.json())
      .then(data => {
        const found = data.find(h => h.originalId === hospitalId);
        setHospital(found);
      })
      .catch(err => console.error(err));

    // Fetch Doctors
    fetch(`http://localhost:5000/api/doctors?hospitalId=${hospitalId}&speciality=${specialityName}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDoctors(data);
        } else {
          // Fallback logic for demo
          const fallbackDoctors = [
            {
              originalId: `dummy-1-${Date.now()}`,
              name: 'Dr. Rakesh Verma',
              hospitalId,
              speciality: specialityName,
              rating: 4.6,
              reviewsCount: 34,
              experience: '10 Years',
              fee: 500,
              image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
              about: `Specialist in ${specialityName} with over 10 years of experience.`,
              availability: ['Mon', 'Wed', 'Fri'],
              timeSlots: ['10:00 AM', '12:00 PM', '04:00 PM'],
              reviews: []
            },
            {
              originalId: `dummy-2-${Date.now()}`,
              name: 'Dr. Sunita Patel',
              hospitalId,
              speciality: specialityName,
              rating: 4.8,
              reviewsCount: 112,
              experience: '18 Years',
              fee: 800,
              image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
              about: `Renowned ${specialityName} expert. Focuses on patient-centric holistic care.`,
              availability: ['Tue', 'Thu', 'Sat'],
              timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM'],
              reviews: []
            }
          ];
          setDoctors(fallbackDoctors);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [hospitalId, specialityName]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const response = await authFetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: selectedDoctor.originalId,
          slot: bookingSlot,
          doctorName: selectedDoctor.name,
          speciality: selectedDoctor.speciality,
          hospitalName: hospital?.name || ''
        }),
      });
      const result = await response.json();
      setTimeout(() => {
        navigate(`/queue/${result.bookingId}?doctor=${selectedDoctor.originalId}`);
      }, 1000);
    } catch (error) {
      console.error('Booking failed', error);
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12 flex flex-col md:flex-row">
      {/* Left Area: Doctors List */}
      <div className="flex-[2] flex flex-col h-screen md:sticky top-0 overflow-y-auto hide-scrollbar">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{specialityName} Specialists</h1>
            {hospital && <p className="text-sm text-slate-500 truncate">{hospital.name}</p>}
          </div>
        </header>

        <div className="p-6 space-y-4">
          {doctors.map(doctor => (
            <div 
              key={doctor.originalId} 
              className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all ${selectedDoctor?.originalId === doctor.originalId ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200 hover:border-blue-300 shadow-sm'}`}
              onClick={() => { setSelectedDoctor(doctor); setBookingSlot(null); }}
            >
              <div className="flex gap-4">
                <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-full object-cover shadow-sm" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800">{doctor.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg font-bold text-xs">
                      <span>{doctor.rating}</span>
                      <Star size={12} className="fill-current" />
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 font-semibold mb-1">{doctor.experience} Experience</p>
                  <p className="text-sm text-slate-500 mb-2 line-clamp-1">{doctor.about}</p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {doctor.availability.join(', ')}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">₹{doctor.fee}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area: Booking Panel */}
      <div className="flex-[1.2] bg-white border-l border-slate-200 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] md:sticky top-0 h-screen overflow-y-auto">
        {!selectedDoctor ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Select a Doctor</h3>
            <p className="max-w-xs">Click on a doctor's profile from the list to view their available slots and book an appointment.</p>
          </div>
        ) : (
          <div className="p-6 md:p-8 flex flex-col h-full">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Book Appointment</h3>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 flex items-center gap-4">
              <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-slate-800">{selectedDoctor.name}</h4>
                <p className="text-sm text-slate-500">{selectedDoctor.speciality}</p>
                <p className="text-xs font-bold text-emerald-600 mt-1">Consultation Fee: ₹{selectedDoctor.fee}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-700">Available Slots</h4>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">Today</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedDoctor.timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setBookingSlot(slot)}
                    className={`py-2 px-3 rounded-xl text-sm font-bold border transition-all ${bookingSlot === slot ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <button
                disabled={!bookingSlot || isBooking}
                onClick={handleBook}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${bookingSlot && !isBooking ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Confirming...
                  </>
                ) : (
                  <>Confirm Booking</>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 font-medium flex items-center justify-center gap-1">
                <CheckCircle2 size={14}/> No payment required to book
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
