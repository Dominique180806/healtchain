// /React/src/pages/PharmacyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

const PharmacyDashboard = () => {
  const [pharmacyInfo, setPharmacyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch pharmacy info
  useEffect(() => {
    const fetchPharmacyInfo = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          throw new Error('Utilisateur non connecté');
        }
        const { data } = await axios.get(`http://localhost:5000/api/auth/pharmacy-info?email=${email}`);
        setPharmacyInfo(data);
      } catch (error) {
        toast.error('Erreur lors de la récupération des informations', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'colored',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacyInfo();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    toast.info('Déconnexion réussie. Redirection vers la page de connexion...', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'colored',
    });
    setTimeout(() => navigate('/login'), 2000);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Pharmacy-specific menu items
  const menuItems = [
    { name: 'Tableau de Bord', path: '/pharmacy-dashboard' },
    { name: 'Inventaire', path: '/pharmacy/inventory' },
    { name: 'Ordonnances', path: '/pharmacy/prescriptions' },
    { name: 'Ventes & Livraisons', path: '/pharmacy/sales-deliveries' },
    { name: 'Paiements', path: '/pharmacy/payments' },
    { name: 'Vérification QR', path: '/pharmacy/qr-verification' },
  ];

  // Pharmacy-specific actions
  const actions = [
    {
      name: 'Gérer l’Inventaire',
      path: '/pharmacy/inventory',
      description: 'Ajoutez, mettez à jour ou suivez votre stock de médicaments avec une traçabilité garantie par Hedera.',
      icon: 'M4 7h16M4 12h16M4 17h16',
    },
    {
      name: 'Vérifier les Ordonnances',
      path: '/pharmacy/prescriptions',
      description: 'Validez les ordonnances des patients en temps réel via la blockchain Hedera.',
      icon: 'M5 12h14M12 5l7 7-7 7',
    },
    {
      name: 'Suivre Ventes & Livraisons',
      path: '/pharmacy/sales-deliveries',
      description: 'Gérez les ventes et livraisons avec une traçabilité transparente.',
      icon: 'M3 3h18v18H3z',
    },
    {
      name: 'Gérer les Paiements',
      path: '/pharmacy/payments',
      description: 'Traitez des paiements sécurisés et décentralisés via la blockchain Hedera.',
      icon: 'M6 3v18M9 6h6M9 9h6M9 12h6M9 15h6',
    },
    {
      name: 'Vérifier les QR Codes',
      path: '/pharmacy/qr-verification',
      description: 'Scannez les QR codes pour confirmer l’authenticité des médicaments.',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col mt-24">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg p-4 flex items-center justify-between fixed w-full top-0 z-50"
      >
        {/* Left: Logo, Title */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="HealthChain Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-blue-600">HealthChain AFRICA</h1>
        </div>
        {/* Center: Menu (Desktop) */}
        <div className="hidden md:flex items-center justify-center space-x-6">
          {menuItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              whileHover={{ scale: 1.05 }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {item.name}
            </motion.a>
          ))}
          
        </div>
        {/* Right: Search, Notifications, Profile (Desktop) */}
        <div className="hidden md:flex items-center justify-end space-x-4">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            placeholder="Rechercher médicaments, ordonnances..."
          />
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
          </motion.div>
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">2</span>
          </motion.div>
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/profile')}
          >
            <img
              src={logo}
              alt="Profile Photo"
              className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
            />
          </motion.div>
        </div>
        {/* Right: Mobile Menu */}
        <div className="md:hidden flex items-center space-x-4">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
            placeholder="Rechercher..."
          />
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
          </motion.div>
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">2</span>
          </motion.div>
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/profile')}
          >
            <img
              src={logo}
              alt="Profile Photo"
              className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
            />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden"
          >
            {menuItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                whileHover={{ scale: 1.05 }}
                className="block p-4 text-blue-600 hover:bg-gray-100"
              >
                {item.name}
              </motion.a>
            ))}
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
                setIsMenuOpen(false);
              }}
              whileHover={{ scale: 1.05 }}
              className="block p-4 text-blue-600 hover:bg-gray-100"
            >
              Déconnexion
            </motion.a>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 pt-20 md:pt-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-3xl mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            Bienvenue, {loading ? 'Pharmacien' : pharmacyInfo?.pharmacyName || 'Pharmacien'}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed">
            Gérez votre pharmacie avec efficacité grâce à la blockchain Hedera. Suivez votre inventaire, validez les ordonnances, traquez les ventes et paiements en toute sécurité.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Voir mon profil
          </motion.button>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white text-blue-600 p-6 rounded-xl shadow-xl flex flex-col items-center"
          >
            <h2 className="text-xl font-bold mb-2">Stock de Médicaments</h2>
            <p className="text-4xl font-extrabold text-gray-700">{loading ? '...' : pharmacyInfo?.stockCount || '250'}</p>
            <p className="text-center text-gray-700 mt-2">Articles en stock actuellement.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white text-blue-600 p-6 rounded-xl shadow-xl flex flex-col items-center"
          >
            <h2 className="text-xl font-bold mb-2">Ventes ce Mois</h2>
            <p className="text-4xl font-extrabold text-gray-700">{loading ? '...' : pharmacyInfo?.salesCount || '120'}</p>
            <p className="text-center text-gray-700 mt-2">Ventes effectuées ce mois-ci.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white text-blue-600 p-6 rounded-xl shadow-xl flex flex-col items-center"
          >
            <h2 className="text-xl font-bold mb-2">Livraisons en Cours</h2>
            <p className="text-4xl font-extrabold text-gray-700">{loading ? '...' : pharmacyInfo?.deliveriesCount || '15'}</p>
            <p className="text-center text-gray-700 mt-2">Livraisons en attente.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white text-blue-600 p-6 rounded-xl shadow-xl flex flex-col items-center"
          >
            <h2 className="text-xl font-bold mb-2">Paiements Reçus</h2>
            <p className="text-4xl font-extrabold text-gray-700">{loading ? '...' : pharmacyInfo?.paymentsCount || '80'}</p>
            <p className="text-center text-gray-700 mt-2">Paiements traités ce mois-ci.</p>
          </motion.div>
        </div>

        {/* Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="w-full max-w-6xl mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Vos Actions</h2>
          <p className="text-lg mb-6 text-center leading-relaxed">
            Optimisez la gestion de votre pharmacie avec des outils modernes et sécurisés.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, index) => (
              <motion.div
                key={action.name}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="bg-blue-600 text-white p-6 rounded-xl shadow-xl text-center cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                </svg>
                <h3 className="text-xl font-bold mb-2">{action.name}</h3>
                <p className="text-sm">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="w-full max-w-4xl bg-white text-blue-600 p-8 rounded-xl shadow-xl mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">À Propos de HealthChain Trace</h2>
          <p className="text-gray-700 leading-relaxed mb-6 text-center">
            HealthChain Trace révolutionne la gestion des pharmacies en Afrique grâce à la blockchain Hedera. Simplifiez vos opérations avec une traçabilité des médicaments, des paiements sécurisés et une validation des ordonnances en temps réel.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
              <span>Gestion sécurisée de l’inventaire avec traçabilité Hedera.</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
              <span>Validation des ordonnances en temps réel via blockchain.</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
              <span>Paiements sécurisés et décentralisés pour les ventes.</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
              <span>Vérification des QR codes pour garantir l’authenticité des médicaments.</span>
            </li>
          </ul>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Optimisez Votre Pharmacie</h2>
          <p className="text-lg mb-6">
            Commencez dès aujourd’hui à gérer votre inventaire et vos ventes avec une sécurité et une efficacité inégalées.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pharmacy/inventory')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Gérer l’inventaire
          </motion.button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-300">
        <div className="flex justify-center items-center space-x-3">
          <img src={logo} alt="HealthChain Logo" className="h-8 w-auto" />
          <p>Propulsé par HealthChain Trace &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default PharmacyDashboard;