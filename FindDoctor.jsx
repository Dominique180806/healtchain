// /React/src/pages/FindDoctor.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState('specialty');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [suggestedSpecialty, setSuggestedSpecialty] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  // États du modal RDV
  const [showRdvModal, setShowRdvModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Nouveau
  const [rdvDate, setRdvDate] = useState('');
  const [rdvTime, setRdvTime] = useState('');
  const [motif, setMotif] = useState('');

  const specialties = [
    'Généraliste', 'Cardiologue', 'Pédiatre', 'Dermatologue', 'Gynécologue-obstétricien',
    'Neurologue', 'Ophtalmologue', 'Chirurgien orthopédiste', 'Dentiste', 'Autre'
  ];

  // Ouvre le modal avec le bon docteur
  const openRdvModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRdvModal(true);
  };

  // Envoi de la demande RDV
  const handleRdvSubmit = async () => {
    const patientEmail = localStorage.getItem('email');
    if (!patientEmail) return toast.error('Connectez-vous');
    if (!selectedDoctor) return;

    try {
      await axios.post('http://localhost:5000/api/appointments/request', {
        patientEmail,
        doctorEmail: selectedDoctor.id,
        date: rdvDate,
        time: rdvTime,
        motif
      });
      toast.success('Demande envoyée !');
      setShowRdvModal(false);
      setSelectedDoctor(null);
      setRdvDate('');
      setRdvTime('');
      setMotif('');
    } catch (err) {
      toast.error('Erreur envoi');
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors/all');
        const doctorsWithFiles = await Promise.all(
          response.data.map(async (doc) => {
            try {
              const info = await axios.get(`http://localhost:5000/api/auth/doctor-info?email=${doc.id}`);
              return {
                ...doc,
                phoneNumber: info.data.phoneNumber || 'Non renseigné',
                files: info.data.files ? JSON.parse(info.data.files) : [],
                profileImage: info.data.profileImage
              };
            } catch (err) {
              return { ...doc, files: [], phoneNumber: 'Non renseigné' };
            }
          })
        );
        setDoctors(doctorsWithFiles);
        setFilteredDoctors(doctorsWithFiles);
      } catch (error) {
        console.error('Erreur fetch doctors:', error);
        toast.error('Erreur lors du chargement des médecins');
      } finally {
        setLoading(false);
      }
       };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;
    if (specialty) {
      filtered = filtered.filter(d =>
        d.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }
    if (location) {
      filtered = filtered.filter(d =>
        d.region.toLowerCase().includes(location.toLowerCase()) ||
        d.country.toLowerCase().includes(location.toLowerCase()) ||
        d.hospital.toLowerCase().includes(location.toLowerCase())
      );
    }
    setFilteredDoctors(filtered);
  }, [specialty, location, doctors]);

  const suggestSpecialty = async () => {
    if (!symptoms.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/ai/suggest-specialty', { symptoms });
      const spec = response.data.specialty;
      setSuggestedSpecialty(spec);
      setSpecialty(spec);
      toast.success(`Spécialité suggérée : ${spec}`);
    } catch (error) {
      toast.error('Impossible de suggérer une spécialité');
    }
  };

  const contactDoctor = () => {
    toast.info('Messagerie en développement');
    navigate('/ai-assistance');
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white mt-20">
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
          <button onClick={() => navigate('/home')} className="text-blue-600 hover:text-blue-800 font-medium">Accueil</button>
          <button className="text-blue-800 font-bold">Trouver un Médecin</button>
          <button onClick={() => navigate('/profile')} className="text-blue-600 hover:text-blue-800 font-medium">Profil</button>
        </div>
      </motion.nav>

      <main className="pt-24 p-4 sm:p-8 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Trouver un Médecin</h1>
          <p className="text-lg text-gray-300">Recherchez par spécialité, région ou décrivez vos symptômes.</p>
        </motion.div>

        {/* Mode de recherche */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setSearchMode('specialty')}
              className={`px-6 py-2 rounded-lg font-medium transition ${searchMode === 'specialty' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Par Spécialité
            </button>
            <button
              onClick={() => setSearchMode('symptoms')}
              className={`px-6 py-2 rounded-lg font-medium transition ${searchMode === 'symptoms' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Par Symptômes
            </button>
          </div>

          {searchMode === 'specialty' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Spécialité</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toutes les spécialités</option>
                    {specialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Région / Pays</label>
                  <input
                    type="text"
                    placeholder="Ex: Alger, Sénégal..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {searchMode === 'symptoms' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <label className="block text-sm font-medium mb-2">Décrivez vos symptômes</label>
              <textarea
                rows="4"
                placeholder="Ex: J'ai mal à la tête, fièvre..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <button
                onClick={suggestSpecialty}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition"
              >
                Analyser mes symptômes
              </button>
              {suggestedSpecialty && (
                <p className="mt-3 text-teal-400">
                  Spécialité suggérée : <strong>{suggestedSpecialty}</strong>
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Liste des médecins */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-400">Chargement...</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="text-center text-gray-400">Aucun médecin trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                  layout
                >
                  <AnimatePresence>
                    {expandedId === doctor.id ? (
                      // DÉTAIL OUVERT
                      <motion.div
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: 90, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden cursor-pointer"
                        onClick={() => toggleExpand(doctor.id)}
                      >
                        <div className="h-40 bg-gradient-to-r from-blue-600 to-teal-600 p-6">
                          <div className="flex justify-center">
                            <img
                              src={doctor.photo}
                              alt={doctor.fullName}
                              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                              onError={(e) => { e.target.src = '/default-doctor.png'; }}
                            />
                          </div>
                        </div>
                        <div className="p-6 -mt-12">
                          <h3 className="text-2xl font-bold text-center">{doctor.fullName}</h3>
                          <p className="text-teal-600 text-center font-medium text-lg">{doctor.specialty}</p>
                          <div className="mt-4 space-y-3 text-sm">
                            <p><strong>Téléphone :</strong> {doctor.phoneNumber}</p>
                            <p><strong>Hôpital :</strong> {doctor.hospital}</p>
                            <p><strong>Adresse :</strong> {doctor.address}</p>
                            <p><strong>Expérience :</strong> {doctor.yearsExperience} ans</p>
                            <p><strong>Localisation :</strong> {doctor.region}, {doctor.country}</p>
                          </div>
                          <div className="mt-5">
                            <p className="font-semibold text-gray-700 mb-2">Diplômes & Certificats :</p>
                            {doctor.files.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2">
                                {doctor.files.map((file, i) => (
                                  <a
                                    key={i}
                                    href={`http://localhost:5000/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-2 bg-gray-100 rounded text-center text-xs text-blue-600 hover:bg-gray-200 transition"
                                  >
                                    {file.includes('.pdf') ? 'PDF' : 'JPG'} {i + 1}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-xs">Aucun diplôme uploadé</p>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleExpand(doctor.id); }}
                            className="mt-6 w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
                          >
                            Fermer
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      // CARTE NORMALE
                      <motion.div
                        layout
                        className="bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden cursor-pointer"
                        onClick={() => toggleExpand(doctor.id)}
                      >
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-teal-500"></div>
                        <div className="p-6 -mt-16">
                          <div className="bg-white rounded-full w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
                            <img
                              src={doctor.photo}
                              alt={doctor.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/default-doctor.png'; }}
                            />
                          </div>
                          <h3 className="text-xl font-bold text-center">{doctor.fullName}</h3>
                          <p className="text-teal-600 text-center font-medium">{doctor.specialty}</p>
                          <p className="text-sm text-gray-600 text-center mt-1">
                            {doctor.region}, {doctor.country}
                          </p>
                          <p className="text-xs text-gray-500 text-center mt-2">
                            {doctor.yearsExperience} ans d'expérience
                          </p>
                          <p className="text-xs text-gray-500 text-center">
                            {doctor.hospital}
                          </p>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); openRdvModal(doctor); }}
                              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 text-sm"
                            >
                              Prendre RDV
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); contactDoctor(); }}
                              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-sm"
                            >
                              Contacter
                            </button>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleExpand(doctor.id); }}
                            className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Voir le détail
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL RDV (en dehors du map) */}
        {showRdvModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-xl max-w-md w-full text-gray-800"
            >
              <h3 className="text-xl font-bold mb-4">RDV avec Dr. {selectedDoctor.fullName}</h3>
              <input
                type="date"
                value={rdvDate}
                onChange={e => setRdvDate(e.target.value)}
                className="w-full p-2 border mb-3 rounded"
              />
              <input
                type="time"
                value={rdvTime}
                onChange={e => setRdvTime(e.target.value)}
                className="w-full p-2 border mb-3 rounded"
              />
              <textarea
                placeholder="Motif de consultation"
                value={motif}
                onChange={e => setMotif(e.target.value)}
                className="w-full p-2 border mb-3 rounded h-24"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRdvSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded font-medium"
                >
                  Envoyer
                </button>
                <button
                  onClick={() => {
                    setShowRdvModal(false);
                    setSelectedDoctor(null);
                    setRdvDate('');
                    setRdvTime('');
                    setMotif('');
                  }}
                  className="flex-1 bg-gray-300 py-2 rounded"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-gray-400 mt-12">
        <p>Propulsé par HealthChain Trace © 2025</p>
      </footer>
    </div>
  );
};

export default FindDoctor;