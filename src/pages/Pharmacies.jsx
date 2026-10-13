import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Filter, Search, ArrowLeft, Pill, Clock, Truck } from 'lucide-react';
import API_BASE_URL from '../api';

export default function Pharmacies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/pharmacies`)
      .then(res => res.json())
      .then(data => {
        setPharmacies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch pharmacies', err);
        setLoading(false);
      });
  }, []);
  
  // Sort by distance ascending by default
  const sortedPharmacies = [...pharmacies].sort((a, b) => a.distance - b.distance);
  
  const filteredPharmacies = sortedPharmacies.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="text-slate-500 hover:text-emerald-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
              <Pill size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Nearby Pharmacies</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search pharmacies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 shadow-sm"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            Loading pharmacies...
          </div>
        )}

        {/* Pharmacy List */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPharmacies.map(pharmacy => (
              <Link 
                key={pharmacy.originalId} 
                to={`/pharmacies/${pharmacy.originalId}`}
                className="block bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="sm:w-40 h-40 sm:h-auto overflow-hidden relative shrink-0">
                    <img 
                      src={pharmacy.image} 
                      alt={pharmacy.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-slate-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Clock size={12} /> {pharmacy.status}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h2 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
                          {pharmacy.name}
                        </h2>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg font-bold text-sm shrink-0">
                          <span>{pharmacy.rating}</span>
                          <Star size={14} className="fill-current" />
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 mt-2 text-sm text-slate-500 font-medium">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="shrink-0 text-slate-400 mt-0.5" />
                          <span className="truncate">{pharmacy.address} ({pharmacy.distanceStr})</span>
                        </div>
                        <div className="flex items-start gap-2 text-emerald-600">
                          <Truck size={16} className="shrink-0 mt-0.5" />
                          <span>Delivery in {pharmacy.deliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        {pharmacy.freeDeliveryAbove > 0 ? `Free delivery above ₹${pharmacy.freeDeliveryAbove}` : 'Free delivery on all orders'}
                      </span>
                      <span className="text-emerald-600 font-semibold group-hover:pr-2 transition-all flex items-center gap-1 text-sm">
                        Upload Prescription <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">→</span>
                      </span>
                    </div>
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
