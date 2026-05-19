import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, UploadCloud, CheckCircle2, FileText, X, Pill, ShieldCheck, Clock, Truck } from 'lucide-react';

export default function PharmacyDetails() {
  const { pharmacyId } = useParams();
  const navigate = useNavigate();
  
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/pharmacies')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.originalId === pharmacyId);
        setPharmacy(found);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch pharmacy', err);
        setLoading(false);
      });
  }, [pharmacyId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!pharmacy) return <div className="p-8">Pharmacy not found</div>;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setIsSubmitting(true);
      try {
        await fetch('http://localhost:5000/api/medicine-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pharmacyId: pharmacy.originalId,
            deliveryAddress,
            notes,
            prescriptionFile: file.name // Simulating file upload
          })
        });
        setIsSubmitting(false);
        setIsSubmitted(true);
      } catch (err) {
        console.error('Order failed', err);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-emerald-600 transition-colors p-2 -ml-2 rounded-full hover:bg-slate-100">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Order Medicines</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        
        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex shrink-0 items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Prescription Submitted!</h2>
            <p className="text-slate-600 max-w-md mb-8">
              Your prescription has been sent to <strong>{pharmacy.name}</strong>. A pharmacist will review it and dispatch your order shortly.
            </p>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 w-full max-w-sm mb-8 flex items-center gap-4 text-left shadow-sm">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                <Truck size={24} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Estimated Delivery</p>
                <p className="text-blue-600 font-bold">{pharmacy.deliveryTime}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left: Pharmacy Info */}
            <div className="md:col-span-1">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <Pill size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">{pharmacy.name}</h2>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg font-bold text-xs inline-flex mb-4">
                  <span>{pharmacy.rating}</span>
                  <Star size={12} className="fill-current" />
                </div>
                
                <div className="space-y-4 text-sm text-slate-600 font-medium border-t border-slate-100 pt-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-slate-400 shrink-0" />
                    <span>{pharmacy.address} ({pharmacy.distanceStr})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-slate-400 shrink-0" />
                    <span>{pharmacy.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="text-emerald-500 shrink-0" />
                    <span className="text-emerald-700">Delivery in {pharmacy.deliveryTime}</span>
                  </div>
                </div>

                <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 text-xs text-slate-500">
                  <ShieldCheck size={20} className="text-slate-400 shrink-0" />
                  <p>All prescriptions are verified by registered pharmacists before dispatch.</p>
                </div>
              </div>
            </div>

            {/* Right: Upload Form */}
            <div className="md:col-span-2">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload Prescription</h3>
                <p className="text-slate-500 font-medium mb-8">Please upload a clear, legible photo or PDF of your valid prescription.</p>

                <form onSubmit={handleSubmit}>
                  {/* Drag and Drop Zone */}
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 mb-8 ${
                      isDragging ? 'border-emerald-500 bg-emerald-50/50' : 
                      file ? 'border-emerald-200 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {!file ? (
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                          <UploadCloud size={32} />
                        </div>
                        <div>
                          <p className="text-slate-700 font-semibold mb-1">Drag & drop your file here</p>
                          <p className="text-slate-400 text-sm">or click to browse from your device</p>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-2">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                        <input 
                          type="file" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.pdf"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                            <FileText size={24} />
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={removeFile}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delivery Details */}
                  <div className="space-y-4 mb-8">
                    <h4 className="font-bold text-slate-800">Delivery Details</h4>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1.5">Delivery Address</label>
                      <textarea 
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700 resize-none h-24"
                        placeholder="Enter your full address..."
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1.5">Additional Notes (Optional)</label>
                      <input 
                        type="text" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700"
                        placeholder="E.g. Call before delivery, substitute brands if needed..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-slate-100 pt-6">
                    <button 
                      type="submit" 
                      disabled={!file || isSubmitting}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                        file && !isSubmitting
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 active:scale-95' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Processing...</>
                      ) : (
                        <>Place Order</>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}
