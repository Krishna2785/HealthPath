import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Search, Heart, Stethoscope, Bone, Baby, User, Activity, Brain, Siren } from 'lucide-react';
import { specialitiesIcons } from '../data/mockData';
import API_BASE_URL from '../api';

const iconMap = {
  Heart, Stethoscope, Bone, Baby, User, Activity, Brain, Siren
};

export default function HospitalDetails() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hospitals`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(h => h.originalId === hospitalId);
        setHospital(found);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch hospital', err);
        setLoading(false);
      });
  }, [hospitalId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!hospital) return <div className="p-8">Hospital not found</div>;

  const filteredSpecialities = hospital.specialities.filter(s => 
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-800 truncate">{hospital.name}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {/* Hospital Hero Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8 mb-8">
          <img 
            src={hospital.image} 
            alt={hospital.name} 
            className="w-full md:w-1/3 h-48 md:h-64 object-cover rounded-2xl"
          />
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                {hospital.type}
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-bold text-sm">
                {hospital.status}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-bold text-sm">
                <span>{hospital.rating}</span>
                <Star size={14} className="fill-current" />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">{hospital.name}</h2>
            
            <div className="space-y-3 text-slate-600 font-medium">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{hospital.distanceStr}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{hospital.timings}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Departments Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Medical Departments</h3>
            <div className="relative w-full sm:w-72">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search departments..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSpecialities.map(speciality => {
              const iconName = specialitiesIcons[speciality] || 'Activity';
              const Icon = iconMap[iconName] || Activity;
              
              return (
                <Link 
                  key={speciality} 
                  to={`/hospitals/${hospital.originalId}/speciality/${encodeURIComponent(speciality)}`}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col items-center text-center gap-3"
                >
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-blue-700 line-clamp-2">
                    {speciality}
                  </span>
                </Link>
              );
            })}
          </div>
          
          {filteredSpecialities.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
              No departments found matching "{searchTerm}"
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
