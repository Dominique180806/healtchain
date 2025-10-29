
// /React/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SetPassword from './pages/SetPassword';
import DoctorCompleteInfo from './pages/DoctorCompleteInfo';
import PharmacyCompleteInfo from './pages/PharmacyCompleteInfo';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PatientInfo from './pages/PatientInfo';
import Profile from './pages/Profile';
import Home from './pages/Home';
import DoctorDashboard from './pages/DoctorDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';
import FindDoctor from './pages/FindDoctor';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorSchedule from './pages/DoctorSchedule';
// Pages temporaires (à créer plus tard)
import Placeholder from './pages/Placeholder';
import DoctorPrescriptions from './pages/DoctorPrescriptions';
import DoctorPatients from './pages/DoctorPatients';
import DoctorOrderMedications from './pages/DoctorOrderMedications';
import DoctorPharmacies from './pages/DoctorPharmacies';
import AiAssistance from './pages/AiAssistance';
import FindPharmacy from './pages/FindPharmacy';
import HealthSpace from './pages/HealthSpace';
const App = () => {
  return (
    <Routes>
      {/* Auth & Onboarding */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/doctor/schedule" element={<DoctorSchedule />} />
      {/* Complétion profil */}
      <Route path="/patient-info" element={<PatientInfo />} />
      <Route path="/doctor-complete-info" element={<DoctorCompleteInfo />} />
      <Route path="/pharmacy-complete-info" element={<PharmacyCompleteInfo />} />
      <Route path="/health-space" element={<HealthSpace />} />
      {/* Dashboards */}
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      <Route path="/dashboard" element={<PharmacyDashboard />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      {/* Patient Routes */}
      <Route path="/find-doctor" element={<FindDoctor />} />
      <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
      <Route path="/doctor/order-medications" element={<DoctorOrderMedications />} />
<Route path="/doctor/pharmacies" element={<DoctorPharmacies />} />
      <Route path="/buy-medication" element={<Placeholder title="Achat de Médicaments" />} />
     
      <Route path="/purchase-history" element={<Placeholder title="Historique des Achats" />} />
      <Route path="/medication-search" element={<Placeholder title="Recherche de Médicaments" />} />
      <Route path="/pharmacy-search" element={<Placeholder title="Recherche de Pharmacies" />} />
      <Route path="/doctor/patients" element={<DoctorPatients />} />
      {/* Doctor Routes */}
    
      <Route path="/doctor/prescriptions" element={<Placeholder title="Ordonnances" />} />

      {/* Pharmacy Routes */}
      <Route path="/pharmacy/inventory" element={<Placeholder title="Inventaire" />} />
      <Route path="/pharmacy/prescriptions" element={<Placeholder title="Vérification des Ordonnances" />} />
      <Route path="/pharmacy/qr-verification" element={<Placeholder title="Vérification QR" />} />
      <Route path="/ai-assistance" element={<AiAssistance />} />
<Route path="/find-pharmacy" element={<FindPharmacy />} />
      {/* Pages futures (temporaires) */}
      <Route path="/chat/doctor/:id" element={<Placeholder title="Messagerie avec le Médecin" />} />
      <Route path="/appointment/book/:id" element={<Placeholder title="Prise de Rendez-vous" />} />

      {/* 404 */}
      <Route path="*" element={<div className="p-10 text-center text-2xl">Page non trouvée</div>} />
    </Routes>
  );
};

export default App;