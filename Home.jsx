// /React/src/pages/Home.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'patient';

  const handleLogout = () => {
    localStorage.clear();
    toast.info('Déconnexion réussie. Redirection vers la page de connexion...', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'colored',
    });
    setTimeout(() => navigate('/login'), 2000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Role-specific configurations
  const roleConfig = {
    patient: {
      heroTitle: 'Bienvenue sur HealthChain Trace',
      heroDescription: 'Gérez vos soins de santé en toute sécurité en Afrique. Suivez vos médicaments, consultez vos dossiers médicaux sécurisés et connectez-vous avec des professionnels grâce à la blockchain Hedera.',
      menuItems: [
        { name: 'Accueil', path: '/home' },
      
        { name: 'Trouver un Médecin', path: '/find-doctor' },
        { name: 'Trouver une Pharmacie', path: '/find-pharmacy' },
      ],
      actions: [
        { name: 'Trouver un Docteur', path: '/find-doctor', description: 'Recherchez et contactez des docteurs qualifiés près de chez vous.', icon: 'M4 7h16M4 12h16M4 17h16' },
        { name: 'Assistance IA', path: '/ai-assistance', description: 'Obtenez des conseils médicaux personnalisés via notre IA sécurisée.', icon: 'M5 12h14M12 5l7 7-7 7' },

        { name: 'Trouver une Pharmacie', path: '/find-pharmacy', description: 'Localisez les pharmacies partenaires près de chez vous.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
      ],
    },
    doctor: {
      heroTitle: 'HealthChain Trace pour Médecins',
      heroDescription: 'Gérez vos patients, rédigez des ordonnances sécurisées et collaborez avec des pharmacies grâce à la blockchain Hedera.',
      menuItems: [
        { name: 'Accueil', path: '/home' },
        { name: 'Patients', path: '/doctor/patients' },
        { name: 'Ordonnances', path: '/doctor/prescriptions' },
        { name: 'Pharmacies', path: '/find-pharmacy' },
      ],
      actions: [
        { name: 'Gérer les Patients', path: '/doctor/patients', description: 'Consultez et mettez à jour les dossiers médicaux de vos patients en toute sécurité.', icon: 'M4 7h16M4 12h16M4 17h16' },
        { name: 'Écrire une Ordonnance', path: '/doctor/prescriptions', description: 'Créez des ordonnances sécurisées sur la blockchain.', icon: 'M5 12h14M12 5l7 7-7 7' },
        { name: 'Collaborer avec Pharmacies', path: '/find-pharmacy', description: 'Connectez-vous avec des pharmacies pour assurer la disponibilité des médicaments.', icon: 'M3 3h18v18H3z' },
      ],
    },
    pharmacy: {
      heroTitle: 'HealthChain Trace pour Pharmacies',
      heroDescription: 'Gérez votre inventaire, vérifiez les ordonnances et assurez la traçabilité des médicaments avec la blockchain Hedera.',
      menuItems: [
        { name: 'Accueil', path: '/home' },
        { name: 'Inventaire', path: '/pharmacy/inventory' },
        { name: 'Ordonnances', path: '/pharmacy/prescriptions' },
        { name: 'Vérification QR', path: '/pharmacy/qr-verification' },
      ],
      actions: [
        { name: 'Gérer l’Inventaire', path: '/pharmacy/inventory', description: 'Suivez et mettez à jour votre stock de médicaments en temps réel.', icon: 'M4 7h16M4 12h16M4 17h16' },
        { name: 'Vérifier les Ordonnances', path: '/pharmacy/prescriptions', description: 'Validez les ordonnances des patients via la blockchain.', icon: 'M5 12h14M12 5l7 7-7 7' },
        { name: 'Scanner QR Codes', path: '/pharmacy/qr-verification', description: 'Vérifiez l’authenticité des médicaments avec des QR codes.', icon: 'M3 3h18v18H3z' },
      ],
    },
  };

  const { heroTitle, heroDescription, menuItems, actions } = roleConfig[role] || roleConfig.patient;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col mt-20">
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
            placeholder="Rechercher médicaments, pharmaciens..."
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-3xl mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed">
            {heroDescription}
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Accéder à mon profil
          </motion.button>
        </motion.div>

        {/* Role-Specific Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-4xl mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Vos Actions</h2>
          <p className="text-lg mb-6 text-center leading-relaxed">
            Découvrez les fonctionnalités adaptées à votre rôle pour une expérience santé optimisée.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, index) => (
              <motion.div
                key={action.name}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
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

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white text-blue-600 p-6 rounded-xl shadow-xl flex flex-col items-center"
          >
            <img
              src="https://placehold.co/300x200/png?text=Médicaments"
              alt="Traçabilité des médicaments"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Traçabilité des Médicaments</h2>
            <p className="text-center text-gray-700">
              Vérifiez l’authenticité et l’historique de vos médicaments grâce à la blockchain Hedera, garantissant sécurité et transparence.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white text-blue-600 p-6 rounded-xl shadow-xl flex flex-col items-center"
          >
            <img
              src="https://placehold.co/300x200/png?text=Dossiers"
              alt="Dossiers médicaux"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Dossiers Médicaux Sécurisés</h2>
            <p className="text-center text-gray-700">
              Vos dossiers médicaux sont stockés de manière sécurisée sur la blockchain Hedera, accessibles uniquement par vous et vos professionnels de santé autorisés.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white text-blue-600 p-6 rounded-xl shadow-xl flex flex-col items-center"
          >
            <img
              src="https://placehold.co/300x200/png?text=QR+Code"
              alt="QR Codes"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">QR Codes pour Pharmaciens</h2>
            <p className="text-center text-gray-700">
              Scannez ou générez des QR codes pour une traçabilité instantanée des médicaments en pharmacie.
            </p>
          </motion.div>
        </div>

        <motion.section
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
  className="w-full text-blue-700 py-16 px-6"
>
  <div className="text-center max-w-5xl mx-auto">
    <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
      À propos de HealthChain Trace
    </h2>
    <p className="text-lg text-white mb-12 leading-relaxed max-w-3xl mx-auto">
      HealthChain Trace révolutionne la santé en Afrique en alliant technologie et humanité.
      Grâce à la blockchain <span className="font-semibold text-blue-600">Hedera</span>,
      chaque donnée médicale est protégée, chaque médicament est vérifié,
      et chaque patient reste maître de sa santé numérique.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
    {[
      {
        icon: '🧠',
        title: 'IA Médicale',
        desc: 'Analyse intelligente et recommandations de santé personnalisées grâce à l’IA intégrée.',
      },
      {
        icon: '🔗',
        title: 'Blockchain Sécurisée',
        desc: 'Stockage inviolable de vos dossiers médicaux sur la blockchain Hedera.',
      },
      {
        icon: '💊',
        title: 'Traçabilité Médicaments',
        desc: 'Authentifiez vos traitements et éliminez les contrefaçons grâce au suivi blockchain.',
      },
      {
        icon: '🏥',
        title: 'Interopérabilité Santé',
        desc: 'Connectez médecins, pharmacies et patients sur un même écosystème fluide.',
      },
    ].map((item, i) => (
      <motion.div
        key={i}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 p-6 rounded-2xl shadow-md text-center hover:shadow-lg border border-gray-100"
      >
        <div className="text-4xl mb-3">{item.icon}</div>
        <h3 className="font-bold text-xl mb-2">{item.title}</h3>
        <p className="text-gray-800 text-sm">{item.desc}</p>
      </motion.div>
    ))}
  </div>
</motion.section>

        {/* Call to Action */}
        <motion.section
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
  className="w-full text-center py-16 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white rounded-t-3xl shadow-inner"
>
  <h2 className="text-4xl font-extrabold mb-6 tracking-tight">
    Rejoignez la Révolution de la Santé Africaine
  </h2>
  <p className="text-lg mb-10 max-w-3xl mx-auto leading-relaxed text-gray-100">
    Devenez acteur d’un système médical moderne, sécurisé et transparent.
    Ensemble, créons un écosystème de santé où la confiance et la technologie se rencontrent.
  </p>

<motion.button
  whileHover={{ scale: 1.07 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate('/health-space')}  // ← Changement ici
  className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
>
  Explorer mon Espace Santé
</motion.button>
</motion.section>
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

export default Home;