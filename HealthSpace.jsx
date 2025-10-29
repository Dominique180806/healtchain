// src/pages/HealthSpace.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Heart, Pill, FileText, Calendar, Stethoscope, Package, QrCode, MessageCircle,
  Activity, Shield, TrendingUp, Clock, CheckCircle, AlertCircle, Wallet,
  Brain, MapPin, Truck, UserCheck
} from 'lucide-react';

const HealthSpace = () => {
  const [role] = useState(localStorage.getItem('role') || 'patient');
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Données simulées
  const patientData = {
    name: 'Marie Dupont',
    age: 34,
    bloodType: 'O+',
    allergies: ['Pénicilline'],
    conditions: ['Hypertension'],
    medications: [
      { name: 'Amlor 5mg', dose: '1/jour', status: 'en cours' },
      { name: 'Paracétamol', dose: 'au besoin', status: 'terminé' }
    ],
    appointments: [
      { doctor: 'Dr. Koffi', date: '2025-11-05', time: '14:30', status: 'confirmé' }
    ],
    purchases: 12,
    lastPurchase: '2025-10-25'
  };

  const doctorData = {
    patientsToday: 8,
    pendingPrescriptions: 3,
    messages: 5,
    revenue: '1,250,000 FCFA'
  };

  const pharmacyData = {
    stockLow: 4,
    pendingOrders: 7,
    todayDeliveries: 12,
    qrScans: 45
  };

  const tabs = {
    patient: [
      { id: 'overview', label: 'Vue d’ensemble', icon: Activity },
      { id: 'dossier', label: 'Dossier Médical', icon: FileText },
      { id: 'meds', label: 'Médicaments', icon: Pill },
      { id: 'rdv', label: 'Rendez-vous', icon: Calendar },
      { id: 'ia', label: 'IA Santé', icon: Brain },
    ],
    doctor: [
      { id: 'overview', label: 'Tableau de bord', icon: Activity },
      { id: 'patients', label: 'Patients du jour', icon: UserCheck },
      { id: 'prescriptions', label: 'Ordonnances', icon: FileText },
      { id: 'stats', label: 'Statistiques', icon: TrendingUp },
    ],
    pharmacy: [
      { id: 'overview', label: 'Tableau de bord', icon: Activity },
      { id: 'inventory', label: 'Inventaire', icon: Package },
      { id: 'orders', label: 'Commandes', icon: Truck },
      { id: 'qr', label: 'Scanner QR', icon: QrCode },
    ]
  };

  const renderContent = () => {
    if (role === 'patient') {
      switch (activeTab) {
        case 'overview':
          return <PatientOverview data={patientData} />;
        case 'dossier':
          return <MedicalRecord data={patientData} />;
        case 'meds':
          return <Medications data={patientData} />;
        case 'rdv':
          return <Appointments data={patientData} />;
        case 'ia':
          return <AIHealthAssistant />;
        default:
          return <PatientOverview data={patientData} />;
      }
    } else if (role === 'doctor') {
      switch (activeTab) {
        case 'overview':
          return <DoctorOverview data={doctorData} />;
        case 'patients':
          return <DoctorPatients />;
        case 'prescriptions':
          return <DoctorPrescriptionsPending />;
        case 'stats':
          return <DoctorStats />;
        default:
          return <DoctorOverview data={doctorData} />;
      }
    } else if (role === 'pharmacy') {
      switch (activeTab) {
        case 'overview':
          return <PharmacyOverview data={pharmacyData} />;
        case 'inventory':
          return <PharmacyInventory />;
        case 'orders':
          return <PharmacyOrders />;
        case 'qr':
          return <QRScanner />;
        default:
          return <PharmacyOverview data={pharmacyData} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Mon Espace Santé
          </h1>
          <p className="text-gray-300 text-lg">Tout votre parcours santé en un clic • Sécurisé par Hedera</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs[role].map((tab, i) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-xl'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

// === COMPOSANTS PAR RÔLE ===

const PatientOverview = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard icon={Heart} label="Santé globale" value="Bonne" color="from-green-500 to-emerald-600" />
    <StatCard icon={Pill} label="Médicaments actifs" value={data.medications.filter(m => m.status === 'en cours').length} color="from-blue-500 to-cyan-600" />
    <StatCard icon={Calendar} label="Prochain RDV" value={data.appointments[0]?.date || 'Aucun'} color="from-purple-500 to-pink-600" />
    <StatCard icon={Wallet} label="Achats ce mois" value={data.purchases} color="from-orange-500 to-red-600" />
  </div>
);

const MedicalRecord = ({ data }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <Shield className="w-7 h-7 text-teal-400" /> Dossier Médical Sécurisé
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem label="Nom" value={data.name} />
      <InfoItem label="Âge" value={`${data.age} ans`} />
      <InfoItem label="Groupe sanguin" value={data.bloodType} />
      <InfoItem label="Allergies" value={data.allergies.join(', ')} />
      <InfoItem label="Conditions" value={data.conditions.join(', ')} />
    </div>
  </div>
);

const Medications = ({ data }) => (
  <div className="space-y-4">
    {data.medications.map((med, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg">{med.name}</p>
            <p className="text-sm text-gray-300">{med.dose}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          med.status === 'en cours' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
        }`}>
          {med.status}
        </span>
      </motion.div>
    ))}
  </div>
);

const Appointments = ({ data }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
    <h3 className="text-2xl font-bold mb-6">Prochains Rendez-vous</h3>
    {data.appointments.length > 0 ? (
      <div className="space-y-4">
        {data.appointments.map((apt, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="font-bold">{apt.doctor}</p>
              <p className="text-sm text-gray-300">{format(new Date(apt.date), 'dd MMMM yyyy', { locale: fr })} à {apt.time}</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">Confirmé</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-400 py-8">Aucun rendez-vous prévu</p>
    )}
  </div>
);

const AIHealthAssistant = () => (
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center">
    <Brain className="w-20 h-20 mx-auto text-teal-400 mb-4" />
    <h3 className="text-2xl font-bold mb-3">HealthIA est là pour vous</h3>
    <p className="text-gray-300 mb-6">Posez vos questions médicales en temps réel</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => window.location.href = '/ai-assistance'}
      className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-bold"
    >
      Lancer l’IA
    </motion.button>
  </div>
);

// === DOCTOR COMPONENTS ===
const DoctorOverview = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard icon={UserCheck} label="Patients aujourd'hui" value={data.patientsToday} color="from-teal-500 to-cyan-600" />
    <StatCard icon={FileText} label="Ordonnances en attente" value={data.pendingPrescriptions} color="from-orange-500 to-red-600" />
    <StatCard icon={MessageCircle} label="Messages" value={data.messages} color="from-purple-500 to-pink-600" />
    <StatCard icon={TrendingUp} label="Revenus du mois" value={data.revenue} color="from-green-500 to-emerald-600" />
  </div>
);

const DoctorPatients = () => (
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
    <h3 className="text-2xl font-bold mb-6">Patients du jour</h3>
    <div className="space-y-4">
      {['Marie Dupont', 'Jean Koffi', 'Aminata Traoré'].map((name, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full" />
            <p className="font-medium">{name}</p>
          </div>
          <span className="text-sm text-gray-300">{['14:30', '15:00', '16:15'][i]}</span>
        </div>
      ))}
    </div>
  </div>
);

// === PHARMACY COMPONENTS ===
const PharmacyOverview = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard icon={Package} label="Stock bas" value={data.stockLow} color="from-red-500 to-orange-600" />
    <StatCard icon={Truck} label="Livraisons aujourd'hui" value={data.todayDeliveries} color="from-blue-500 to-cyan-600" />
    <StatCard icon={FileText} label="Commandes en attente" value={data.pendingOrders} color="from-purple-500 to-pink-600" />
    <StatCard icon={QrCode} label="QR scannés" value={data.qrScans} color="from-green-500 to-teal-600" />
  </div>
);

const QRScanner = () => (
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center">
    <QrCode className="w-32 h-32 mx-auto text-teal-400 mb-6" />
    <h3 className="text-2xl font-bold mb-3">Scanner un QR Code</h3>
    <p className="text-gray-300 mb-6">Vérifiez l’authenticité des médicaments en temps réel</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-bold"
    >
      Activer le scanner
    </motion.button>
  </div>
);

// === COMPOSANTS RÉUTILISABLES ===
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-xl text-center`}
  >
    <Icon className="w-10 h-10 mx-auto mb-3" />
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm opacity-90">{label}</p>
  </motion.div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default HealthSpace;