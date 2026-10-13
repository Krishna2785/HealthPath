import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, CheckCircle2, ShieldCheck, Heart, User, Droplet, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

export default function Donation() {
  const navigate = useNavigate();
  const { authFetch, user } = useAuth();
  const [step, setStep] = useState(1);
  const [donationOrgs, setDonationOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrg, setSelectedOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bloodGroup: '',
    pledgeType: 'All Organs & Tissues'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/donation-orgs`)
      .then(res => res.json())
      .then(data => {
        setDonationOrgs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch donation orgs', err);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authFetch(`${API_BASE_URL}/api/organ-pledges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: selectedOrg,
          ...formData
        })
      });
      setIsSubmitting(false);
      setStep(3); // Success step
    } catch (err) {
      console.error('Pledge failed', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-500 hover:text-rose-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Organ Donation Pledge</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        
        {step === 1 && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl p-8 sm:p-12 text-white shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-12 -mr-12 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                    <Heart size={16} className="fill-current" /> Save up to 8 lives
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">Leave a Legacy of Life.</h2>
                  <p className="text-rose-100 text-lg mb-8 max-w-md mx-auto md:mx-0">
                    Thousands are waiting for a second chance. Your pledge today can be their miracle tomorrow.
                  </p>
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-white text-rose-600 hover:bg-rose-50 font-bold px-8 py-4 rounded-xl shadow-xl transition-all active:scale-95 text-lg w-full sm:w-auto"
                  >
                    Pledge Now
                  </button>
                </div>
                <div className="hidden md:flex flex-1 justify-center">
                  <div className="w-48 h-48 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <HeartHandshake size={80} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Orgs */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Our Verified Partners</h3>
              {loading ? (
                <div className="text-center py-8 text-slate-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
                  Loading organizations...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {donationOrgs.map(org => (
                    <div key={org.originalId} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
                      <img src={org.logo} alt={org.name} className="w-16 h-16 object-cover rounded-full mb-4 shadow-sm" />
                      <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{org.name}</h4>
                      <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mb-3">{org.type}</span>
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-auto">
                        <ShieldCheck size={14} /> Verified Partner
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Donor Registration</h2>
              <p className="text-slate-500 font-medium mb-8">Fill out the form below to officially register your pledge.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Org Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Registration Authority</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {donationOrgs.map(org => (
                      <button
                        type="button"
                        key={org.originalId}
                        onClick={() => setSelectedOrg(org.originalId)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedOrg === org.originalId 
                            ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500' 
                            : 'border-slate-200 hover:border-rose-300 bg-white'
                        }`}
                      >
                        <p className="font-bold text-slate-800 text-sm truncate">{org.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{org.type}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-4"></div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1"><User size={14}/> Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm" placeholder="Demo" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1"><Droplet size={14}/> Blood Group</label>
                    <select required name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm">
                      <option value="" disabled>Select Blood Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm" placeholder="demo@healthpath.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm" placeholder="+91 9876543210" />
                  </div>
                </div>

                {/* Consent */}
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input required type="checkbox" className="mt-1 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                    <span className="text-sm text-slate-700 leading-relaxed">
                      I am voluntarily pledging my organs/tissues for transplantation after my death. I have discussed this decision with my family.
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={!selectedOrg || isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                      selectedOrg && !isSubmitting ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30' : 'bg-slate-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {isSubmitting ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Processing...</> : <>Confirm Pledge</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex shrink-0 items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4">Thank You, {formData.name.split(' ')[0]}!</h2>
            <p className="text-xl text-slate-600 mb-12 max-w-lg mx-auto">
              Your pledge has been successfully registered. You are a hero.
            </p>
            
            {/* Virtual Donor Card */}
            <div className="relative w-full max-w-sm mx-auto aspect-[1.6/1] rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(225,29,72,0.3)] mb-12 transform hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-rose-700"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute inset-0 p-6 flex flex-col text-left text-white">
                <div className="flex justify-between items-start mb-auto">
                  <div>
                    <h3 className="font-bold tracking-widest text-rose-200 text-xs uppercase mb-1">Donor Card</h3>
                    <p className="font-black text-xl">{formData.name || 'Demo'}</p>
                  </div>
                  <Heart size={24} className="text-white fill-current" />
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-rose-200 text-xs uppercase tracking-widest mb-0.5">Blood Group</p>
                    <p className="font-bold text-lg">{formData.bloodGroup || 'A+'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-rose-200 text-xs uppercase tracking-widest mb-0.5">Pledged</p>
                    <p className="font-bold text-sm">All Organs</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
            >
              Return Home
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
