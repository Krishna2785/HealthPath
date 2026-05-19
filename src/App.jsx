import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';

// Book Appointment Flow
import Hospitals from './pages/Hospitals';
import HospitalDetails from './pages/HospitalDetails';
import Doctors from './pages/Doctors';
import QueueTracker from './pages/QueueTracker';

// Labs Flow
import Labs from './pages/Labs';
import LabDetails from './pages/LabDetails';
import ReportsDashboard from './pages/ReportsDashboard';

// Pharmacies Flow
import Pharmacies from './pages/Pharmacies';
import PharmacyDetails from './pages/PharmacyDetails';

// Other Flows
import Donation from './pages/Donation';
import ChatBot from './components/ChatBot';

// Protected Route: redirects to /login with the intended path saved as state
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Home is PUBLIC — anyone can see it */}
      <Route path="/" element={<Home />} />

      {/* Book Appointment Flow — requires login */}
      <Route path="/hospitals" element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
      <Route path="/hospitals/:hospitalId" element={<ProtectedRoute><HospitalDetails /></ProtectedRoute>} />
      <Route path="/hospitals/:hospitalId/speciality/:specialityName" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
      <Route path="/queue/:bookingId" element={<ProtectedRoute><QueueTracker /></ProtectedRoute>} />

      {/* Schedule Test Flow — requires login */}
      <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>} />
      <Route path="/labs/:labId" element={<ProtectedRoute><LabDetails /></ProtectedRoute>} />
      <Route path="/labs/reports" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />

      {/* Order Medicine Flow — requires login */}
      <Route path="/pharmacies" element={<ProtectedRoute><Pharmacies /></ProtectedRoute>} />
      <Route path="/pharmacies/:pharmacyId" element={<ProtectedRoute><PharmacyDetails /></ProtectedRoute>} />

      {/* Other Flows — requires login */}
      <Route path="/donation" element={<ProtectedRoute><Donation /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ChatBot />
      </Router>
    </AuthProvider>
  );
}

export default App;
