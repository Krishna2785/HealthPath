import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Filter, Search, ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../api';

export default function Hospitals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hospitals`)
      .then(res => res.json())
      .then(data => {
        setHospitals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch hospitals', err);
        setLoading(false);
      });
  }, []);
  
  // Sort by distance ascending by default
  const sortedHospitals = [...hospitals].sort((a, b) => a.distance - b.distance);
  
  const filteredHospitals = sortedHospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.specialities.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Select a Hospital</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by hospital name or speciality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading hospitals...
          </div>
        )}

        {/* Hospital List */}
        {!loading && (
          <div className="space-y-4">
            {filteredHospitals.map(hospital => (
              <Link 
                key={hospital.originalId} 
                to={`/hospitals/${hospital.originalId}`}
                className="block bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <img 
                    src={hospital.image} 
                    alt={hospital.name} 
                    className="w-full sm:w-48 h-48 sm:h-auto object-cover rounded-xl"
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {hospital.name}
                      </h2>
                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-semibold text-sm shrink-0">
                        <span>{hospital.rating}</span>
                        <Star size={14} className="fill-current" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium mb-4">
                      <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {hospital.type}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {hospital.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {hospital.distanceStr}
                      </span>
                    </div>

                    <div className="text-sm text-slate-600 mb-4 line-clamp-2">
                      <strong>Specialities:</strong> {hospital.specialities.join(', ')}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                        <Clock size={16} />
                        <span className="truncate max-w-[200px] sm:max-w-[400px]">{hospital.timings.split('|')[0]}</span>
                      </span>
                      <span className="text-blue-600 font-semibold group-hover:pr-2 transition-all flex items-center gap-1">
                        View Departments <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {filteredHospitals.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No hospitals found matching your search.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
