import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Stethoscope, 
  Microscope, 
  Pill, 
  HeartHandshake,
  User,
  Activity,
  LogOut,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppointmentsSidebar from '../components/AppointmentsSidebar';

export default function Home() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleUseCurrentLocation = () => {
    setLocation('Current Location (Detected)');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <Activity size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 tracking-tight">
              HealthPath
            </span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Appointments Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm transition-colors border border-blue-100"
                  title="View booked appointments"
                >
                  <ClipboardList size={18} />
                  <span className="hidden sm:inline">My Appointments</span>
                </button>
                {/* User Badge */}
                <div className="hidden sm:flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold text-sm">
                  <User size={18} className="text-blue-600" />
                  <span>{user?.name || 'Demo'}</span>
                </div>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline text-sm">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/20 active:scale-95"
              >
                <User size={18} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative overflow-hidden bg-white">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -right-[5%] w-[50%] h-[60%] rounded-full bg-blue-50/50 blur-3xl" />
            <div className="absolute top-[20%] -left-[10%] w-[40%] h-[50%] rounded-full bg-emerald-50/50 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
              Discover Best Hospitals.<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                Your Place for Health.
              </span>
            </h1>
            <p className="mt-4 text-xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium">
              Book appointments, schedule tests, and order medicines with real-time tracking and verified reviews.
            </p>

            {/* Search Bars Container */}
            <div className="max-w-4xl mx-auto bg-white p-2 sm:p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row gap-3">
              
              {/* Location Input */}
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <MapPin size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Enter your location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700 text-lg placeholder:text-slate-400"
                />
                <button 
                  onClick={handleUseCurrentLocation}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  title="Use current location"
                >
                  <Navigation size={20} />
                </button>
              </div>

              {/* Divider for desktop */}
              <div className="hidden md:block w-px bg-slate-200 my-2" />

              {/* Search Input */}
              <div className="relative flex-[1.5] group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="Search hospitals, doctors, specialities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700 text-lg placeholder:text-slate-400"
                />
              </div>

              {/* Search Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Main Action Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <Link to="/hospitals" className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-start h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 relative z-10">Book Appointment</h3>
              <p className="text-slate-500 relative z-10 leading-relaxed font-medium">Find top doctors & clinics. View real reviews and live queue status.</p>
              <div className="mt-auto pt-6 w-full flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                <span>Explore Doctors</span>
                <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">→</span>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/labs" className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-start h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <Microscope size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 relative z-10">Schedule Test</h3>
              <p className="text-slate-500 relative z-10 leading-relaxed font-medium">Book lab tests at home or nearest center. Get digital reports.</p>
              <div className="mt-auto pt-6 w-full flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                <span>Find Path Labs</span>
                <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">→</span>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/pharmacies" className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-start h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Pill size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 relative z-10">Order Medicine</h3>
              <p className="text-slate-500 relative z-10 leading-relaxed font-medium">Upload prescription and get medicines delivered swiftly.</p>
              <div className="mt-auto pt-6 w-full flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all">
                <span>Nearby Pharmacies</span>
                <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">→</span>
              </div>
            </Link>

            {/* Card 4 */}
            <Link to="/donation" className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-start h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                <HeartHandshake size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 relative z-10">Organ Donation</h3>
              <p className="text-slate-500 relative z-10 leading-relaxed font-medium">Pledge to save lives. Connect with registered NGOs and organizations.</p>
              <div className="mt-auto pt-6 w-full flex items-center text-rose-600 font-semibold group-hover:gap-2 transition-all">
                <span>Join the Cause</span>
                <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">→</span>
              </div>
            </Link>

          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} HealthPath. All rights reserved.</p>
        </div>
      </footer>

      {/* Appointments Sidebar — only for logged in users */}
      {user && <AppointmentsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
    </div>
  );
}
