import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, Plus, Check, Search, Calendar, Home, Building2, Trash2 } from 'lucide-react';

export default function LabDetails() {
  const { labId } = useParams();
  const navigate = useNavigate();
  
  const [lab, setLab] = useState(null);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [visitType, setVisitType] = useState('center'); // 'center' or 'home'
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/labs').then(res => res.json()),
      fetch('http://localhost:5000/api/lab-tests').then(res => res.json())
    ]).then(([labsData, testsData]) => {
      const foundLab = labsData.find(l => l.originalId === labId);
      setLab(foundLab);
      setLabTests(testsData);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch data', err);
      setLoading(false);
    });
  }, [labId]);
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!lab) return <div className="p-8">Lab not found</div>;

  const filteredTests = labTests.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCart = (test) => {
    if (cart.find(t => t.originalId === test.originalId)) {
      setCart(cart.filter(t => t.originalId !== test.originalId));
    } else {
      setCart([...cart, test]);
    }
  };

  const cartTotal = cart.reduce((sum, test) => sum + test.price, 0);

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const response = await fetch('http://localhost:5000/api/test-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labId: lab.originalId,
          tests: cart.map(t => t.originalId),
          visitType,
          totalAmount: cartTotal
        })
      });
      const result = await response.json();
      
      // Pass the state to ReportsDashboard
      navigate('/labs/reports', { state: { bookingId: result.bookingId, cart, lab, visitType } });
    } catch (err) {
      console.error('Booking failed', err);
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-32">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-purple-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-800 truncate">{lab.name}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Lab Info & Tests */}
        <div className="flex-[2] flex flex-col gap-8">
          
          {/* Lab Info Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6">
            <img 
              src={lab.image} 
              alt={lab.name} 
              className="w-full sm:w-48 h-32 object-cover rounded-2xl"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg font-bold text-sm">
                  <span>{lab.rating}</span>
                  <Star size={14} className="fill-current" />
                </div>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-sm font-semibold">
                  {lab.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{lab.name}</h2>
              <div className="space-y-1 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> <span>{lab.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> <span>{lab.timings}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tests Catalog */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-800">Available Tests</h3>
              <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tests..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredTests.map(test => {
                const isSelected = cart.find(t => t.originalId === test.originalId);
                return (
                  <div key={test.originalId} className={`p-4 rounded-2xl border transition-all ${isSelected ? 'border-purple-500 bg-purple-50/30' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 text-lg">{test.name}</h4>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{test.category}</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-3">{test.description}</p>
                        <div className="flex items-center gap-4 text-sm font-semibold">
                          <span className="text-slate-800 flex items-center gap-1">₹{test.price}</span>
                          <span className="text-slate-400 flex items-center gap-1"><Clock size={14}/> {test.turnaround}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <button 
                          onClick={() => toggleCart(test)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? <Check size={20} /> : <Plus size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filteredTests.length === 0 && (
                <div className="text-center py-8 text-slate-500">No tests found matching "{searchTerm}"</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout/Cart Panel */}
        <div className="flex-[1]">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-lg sticky top-24 overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Booking Summary</h3>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} />
                  </div>
                  <p>Add tests to your cart to proceed with booking.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map(test => (
                      <div key={test.originalId} className="flex justify-between items-start text-sm">
                        <div className="flex-1 pr-4">
                          <p className="font-semibold text-slate-800">{test.name}</p>
                          <button onClick={() => toggleCart(test)} className="text-red-500 hover:underline flex items-center gap-1 text-xs mt-1">
                            <Trash2 size={12}/> Remove
                          </button>
                        </div>
                        <span className="font-bold text-slate-800">₹{test.price}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="h-px bg-slate-200"></div>

                  {/* Visit Type */}
                  <div>
                    <p className="font-bold text-slate-800 mb-3 text-sm">Select Visit Type</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setVisitType('center')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-sm font-semibold transition-all ${
                          visitType === 'center' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Building2 size={20} /> Center Visit
                      </button>
                      <button 
                        disabled={!lab.homeCollection}
                        onClick={() => setVisitType('home')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-sm font-semibold transition-all ${
                          !lab.homeCollection ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-100' : 
                          visitType === 'home' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Home size={20} /> Home Sample
                      </button>
                    </div>
                    {!lab.homeCollection && <p className="text-xs text-amber-600 mt-2">Home collection not available for this lab.</p>}
                  </div>

                  <div className="h-px bg-slate-200"></div>

                  {/* Date & Time (Mock) */}
                  <div>
                    <p className="font-bold text-slate-800 mb-3 text-sm">Select Slot</p>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium">
                      <Calendar size={18} className="text-purple-600" />
                      <span>Tomorrow, 09:00 AM</span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200"></div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Total Amount</span>
                    <span className="text-2xl font-black text-slate-800">₹{cartTotal}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Checkout Button */}
            <div className="p-6 bg-white border-t border-slate-200">
              <button 
                disabled={cart.length === 0 || isBooking}
                onClick={handleBook}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  cart.length > 0 && !isBooking
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isBooking ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Processing...</>
                ) : (
                  <>Book {cart.length > 0 ? `${cart.length} Test${cart.length > 1 ? 's' : ''}` : 'Tests'}</>
                )}
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
