import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Filter, Search, ArrowLeft, Home, FlaskConical } from 'lucide-react';
import API_BASE_URL from '../api';

export default function Labs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pathLabs, setPathLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/labs`)
      .then(res => res.json())
      .then(data => {
        setPathLabs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch labs', err);
        setLoading(false);
      });
  }, []);
  
  // Sort by distance ascending by default
  const sortedLabs = [...pathLabs].sort((a, b) => a.distance - b.distance);
  
  const filteredLabs = sortedLabs.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">
              <FlaskConical size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Pathological Labs</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search labs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-700 shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            Loading labs...
          </div>
        )}

        {/* Labs List */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLabs.map(lab => (
              <Link 
                key={lab.originalId} 
                to={`/labs/${lab.originalId}`}
                className="block bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={lab.image} 
                    alt={lab.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {lab.homeCollection && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <Home size={14} /> Home Collection
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors truncate">
                      {lab.name}
                    </h2>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg font-bold text-sm shrink-0">
                      <span>{lab.rating}</span>
                      <Star size={14} className="fill-current" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4 text-sm text-slate-500 font-medium">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
                      <span className="truncate">{lab.address} ({lab.distanceStr})</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock size={16} className="shrink-0 mt-0.5 text-slate-400" />
                      <span className="truncate">{lab.timings}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      {lab.status}
                    </span>
                    <span className="text-purple-600 font-semibold group-hover:pr-2 transition-all flex items-center gap-1">
                      View Tests <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
