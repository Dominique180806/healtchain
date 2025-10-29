// /React/src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { listenToRdvMessages } from '../services/hcs-rdv'; // Service HCS frontend

// Images carousel
import carousel1 from '../assets/carousel1.jpeg';
import carousel2 from '../assets/carousel2.jpeg';
import carousel3 from '../assets/carousel3.jpeg';
import carousel4 from '../assets/carousel4.jpeg';

// Images sections
import soigner from '../assets/soigner.jpeg';
import securiser from '../assets/securiser.jpeg';
import tracer from '../assets/tracer.jpeg';
import collaborer from '../assets/collaborer.jpeg';

const DoctorDashboard = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rdvRequests, setRdvRequests] = useState([]); // Demandes RDV
  const navigate = useNavigate();

  const carouselImages = [carousel1, carousel2, carousel3, carousel4];

  // Auto slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Fetch doctor info
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) throw new Error('Non connecté');
        const response = await axios.get(`http://localhost:5000/api/auth/doctor-info?email=${email}`);
        const data = response.data;
        setDoctorInfo({
          ...data,
          profileImage: data.profileImage ? `http://localhost:5000/${data.profileImage}` : '/default-doctor.png'
        });
      } catch (error) {
        toast.error('Erreur de chargement', { theme: 'colored' });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorInfo();
  }, []);

  // Écoute HCS pour les RDV
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) return;

    const unsubscribe = listenToRdvMessages((msg) => {
      
      if (msg.type === 'RDV_REQUEST' && msg.doctorEmail === email) {
        setRdvRequests(prev => [...prev, { ...msg, id: Date.now() }]);
        toast.info(`Nouveau RDV de ${msg.patientEmail}`, { autoClose: 5000 });
      }
      if (msg.type === 'RESPONSE' && msg.patientEmail === email) {
        toast.success(msg.accepted ? 'RDV confirmé !' : `Refusé: ${msg.reason || 'Non spécifié'}`, { autoClose: 6000 });
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.info('Déconnexion...');
    setTimeout(() => navigate('/login'), 1500);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { name: 'Tableau de Bord', path: '/doctor-dashboard' },
    { name: 'Patients', path: '/doctor/patients' },
    { name: 'Ordonnances', path: '/doctor/prescriptions' },
    { name: 'Commandes', path: '/doctor/order-medications' },
    { name: 'Pharmacies', path: '/doctor/pharmacies' },
  ];

  const features = [
    { img: soigner, title: 'Soigner', text: 'Prenez soin de vos patients avec des outils modernes et sécurisés.' },
    { img: securiser, title: 'Sécuriser', text: 'Protégez les données médicales grâce à la blockchain Hedera.' },
    { img: tracer, title: 'Tracer', text: 'Suivez chaque ordonnance et médicament en temps réel.' },
    { img: collaborer, title: 'Collaborer', text: 'Travaillez en réseau avec les pharmacies et laboratoires.' },
  ];

  const actions = [
    { name: 'Gérer les Patients', path: '/doctor/patients', icon: 'M4 7h16M4 12h16M4 17h16' },
    { name: 'Écrire une Ordonnance', path: '/doctor/prescriptions', icon: 'M5 12h14M12 5l7 7-7 7' },
    { name: 'Commander Médicaments', path: '/doctor/order-medications', icon: 'M3 3h18v18H3z' },
    { name: 'Planifier RDV', path: '/doctor/schedule', icon: 'M6 3v18M9 6h6M9 9h6M9 12h6M9 15h6' },
    { name: 'Collaborer', path: '/doctor/pharmacies', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
  ];

  const respondToRdv = async (requestId, accepted, reason = '') => {
    const doctorEmail = localStorage.getItem('email');
    const request = rdvRequests.find(r => r.requestId === requestId);
    if (!request) return;

    try {
      await axios.post('http://localhost:5000/api/appointments/respond', {
        requestId: requestId,
        doctorEmail,
        patientEmail: request.patientEmail,
        accepted,
        reason: accepted ? null : reason
      });
      setRdvRequests(prev => prev.filter(r => r.id !== requestId));
      toast.success(accepted ? 'RDV confirmé !' : 'RDV refusé');
    } catch (err) {
      toast.error('Erreur réponse');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg p-4 flex items-center justify-between fixed w-full top-0 z-50"
      >
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-blue-600">HealthChain AFRICA</h1>
        </div>
        <div className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.path}
              onClick={(e) => { e.preventDefault(); navigate(item.path); }}
              whileHover={{ scale: 1.05 }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {item.name}
            </motion.a>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            placeholder="Rechercher..."
          />
          <div className="relative">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">0</span>
          </div>
          <div className="relative">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {rdvRequests.length}
            </span>
          </div>
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate('/profile')}
          >
            <img
              src={doctorInfo?.profileImage || '/default-doctor.png'}
              alt="Profil"
              className="h-10 w-10 rounded-full object-cover border-2 border-blue-500 shadow-lg"
              onError={(e) => { e.target.src = '/default-doctor.png'; }}
            />
          </motion.div>
        </div>
        {/* Mobile */}
        <div className="md:hidden flex items-center space-x-3">
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate('/profile')}
          >
            <img
              src={doctorInfo?.profileImage || '/default-doctor.png'}
              alt="Profil"
              className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
              onError={(e) => { e.target.src = '/default-doctor.png'; }}
            />
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden z-40"
            >
              {menuItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => { e.preventDefault(); navigate(item.path); setIsMenuOpen(false); }}
                  className="block p-4 text-blue-600 hover:bg-gray-100"
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                href="#"
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                className="block p-4 text-red-600 font-medium hover:bg-red-50"
              >
                Déconnexion
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-24 p-4 sm:p-8 lg:p-12 mt-12">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 mt-24">
            Bienvenue, Dr. {doctorInfo?.fullName || 'Docteur'}
          </h1>
          <p className="text-lg text-gray-300">
            {doctorInfo?.hospital} • {doctorInfo?.region}, {doctorInfo?.country}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12 mt-24">
          {[
            { label: 'Patients Suivis', value: 0 },
            { label: 'Consultations', value: 0 },
            { label: 'Ordonnances', value: 0 },
            { label: 'Rendez-vous en attente', value: rdvRequests.length },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white text-blue-600 p-6 rounded-xl shadow-xl text-center"
            >
              <h3 className="text-lg font-bold">{stat.label}</h3>
              <p className="text-4xl font-extrabold text-gray-700 mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Demandes de RDV */}
        {rdvRequests.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12 bg-white/10 backdrop-blur p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-teal-400">Demandes de RDV ({rdvRequests.length})</h2>
            <div className="space-y-4">
              {rdvRequests.map((req) => (
                <motion.div
                  key={req.requestId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white text-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{req.patientEmail}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(req.date).toLocaleDateString()} à {req.time} - {req.motif}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => respondToRdv(req.requestId, true)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Raison du refus ?');
                        if (reason !== null) respondToRdv(req.requestId, false, reason);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                    >
                      Refuser
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Carousel */}
        <div className="relative h-96 overflow-hidden rounded-xl shadow-2xl max-w-6xl mx-auto mb-32">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentSlide}
              src={carouselImages[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden flex"
            >
              <img src={feature.img} alt={feature.title} className="w-32 h-32 object-cover" />
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-blue-600">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="max-w-6xl mx-auto mb-0">
          <h2 className="text-3xl font-bold text-center mb-8">Vos Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, i) => (
              <motion.div
                key={action.name}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-blue-600 text-white p-6 rounded-xl shadow-xl text-center cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                </svg>
                <h3 className="text-xl font-bold">{action.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-400 mt-12">
        <p>Propulsé par HealthChain Trace © 2025</p>
      </footer>
    </div>
  );
};

export default DoctorDashboard;