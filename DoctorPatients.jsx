// src/pages/DoctorPatients.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Search, Filter, Plus, Calendar, FileText, User, Phone, Mail, MapPin,
  Clock, AlertCircle, Stethoscope, Pill, Heart, Activity, Eye,
  ChevronDown, ChevronUp, X, Edit, Trash2, Download, Share2
} from 'lucide-react';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: '', email: '', phone: '', dob: '', gender: '', address: '', bloodType: ''
  });
  const navigate = useNavigate();

  // Simuler des patients (remplacer par API réelle)
  useEffect(() => {
    setTimeout(() => {
      setPatients([
        {
          id: 1, fullName: 'Marie Dupont', email: 'marie.dupont@email.com', phone: '+225 01 23 45 67',
          dob: '1990-05-15', gender: 'F', address: 'Abidjan, Cocody', bloodType: 'O+', lastVisit: '2025-10-20',
          conditions: ['Hypertension', 'Diabète'], allergies: ['Pénicilline'], notes: 'Suivi régulier'
        },
        {
          id: 2, fullName: 'Jean Koffi', email: 'jean.koffi@email.com', phone: '+225 07 89 01 23',
          dob: '1985-11-30', gender: 'M', address: 'Yamoussoukro', bloodType: 'A-', lastVisit: '2025-09-10',
          conditions: ['Asthme'], allergies: [], notes: 'Sportif, bon suivi'
        },
        {
          id: 3, fullName: 'Aminata Traoré', email: 'aminata.traore@email.com', phone: '+225 05 55 66 77',
          dob: '2000-03-22', gender: 'F', address: 'Bouaké', bloodType: 'AB+', lastVisit: '2025-10-25',
          conditions: [], allergies: ['Arachides'], notes: 'Étudiante, vaccination à jour'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'recent' && p.lastVisit > '2025-10-01') ||
                         (filter === 'chronic' && p.conditions.length > 0);
    return matchesSearch && matchesFilter;
  });

  const handleAddPatient = () => {
    if (!newPatient.fullName || !newPatient.email) {
      toast.error('Nom et email requis');
      return;
    }
    const patient = {
      ...newPatient,
      id: Date.now(),
      lastVisit: null,
      conditions: [],
      allergies: [],
      notes: ''
    };
    setPatients(prev => [...prev, patient]);
    toast.success('Patient ajouté !');
    setShowAddModal(false);
    setNewPatient({ fullName: '', email: '', phone: '', dob: '', gender: '', address: '', bloodType: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-16 h-16 border-4 border-t-teal-400 border-white rounded-full" />
      </div>
    );
  }

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
            Gestion des Patients
          </h1>
          <p className="text-gray-300 text-lg">Suivez, traitez et collaborez en toute sécurité</p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="all">Tous les patients</option>
            <option value="recent">Visites récentes</option>
            <option value="chronic">Maladies chroniques</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl font-semibold flex items-center gap-2 shadow-xl"
          >
            <Plus className="w-5 h-5" /> Ajouter un patient
          </motion.button>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, i) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPatient(patient)}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl cursor-pointer border border-white/20 hover:border-teal-400 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-teal-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                  {patient.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  patient.conditions.length > 0 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                }`}>
                  {patient.conditions.length > 0 ? 'Chronique' : 'Sain'}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">{patient.fullName}</h3>
              <p className="text-sm text-gray-300 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {patient.email}
              </p>
              <p className="text-sm text-gray-300 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" /> {patient.phone}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Dernière visite: {patient.lastVisit ? format(new Date(patient.lastVisit), 'dd MMM yyyy', { locale: fr }) : 'Jamais'}
                </span>
                <ChevronDown className="w-5 h-5 text-teal-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-16">
            <User className="w-20 h-20 mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">Aucun patient trouvé</p>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-800 via-blue-900 to-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedPatient.fullName}</h2>
                    <p className="text-teal-400">Dossier médical actif</p>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Calendar, label: 'Âge', value: `${new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()} ans` },
                    { icon: Heart, label: 'Groupe', value: selectedPatient.bloodType },
                    { icon: MapPin, label: 'Adresse', value: selectedPatient.address },
                    { icon: Activity, label: 'Dernière visite', value: selectedPatient.lastVisit ? format(new Date(selectedPatient.lastVisit), 'dd MMM yyyy', { locale: fr }) : '—' },
                  ].map((info, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
                      <info.icon className="w-6 h-6 text-teal-400 mb-2" />
                      <p className="text-sm text-gray-400">{info.label}</p>
                      <p className="font-semibold">{info.value}</p>
                    </div>
                  ))}
                </div>

                {/* Conditions & Allergies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Stethoscope className="w-6 h-6 text-red-400" /> Maladies chroniques
                    </h3>
                    {selectedPatient.conditions.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPatient.conditions.map((c, i) => (
                          <span key={i} className="inline-block px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-sm">
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-green-400">Aucune</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 text-orange-400" /> Allergies
                    </h3>
                    {selectedPatient.allergies.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPatient.allergies.map((a, i) => (
                          <span key={i} className="inline-block px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-green-400">Aucune</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Calendar, label: 'Prendre RDV', color: 'from-teal-500 to-blue-600', path: '/doctor/schedule' },
                    { icon: FileText, label: 'Ordonnance', color: 'from-green-500 to-emerald-600', path: '/doctor/prescriptions' },
                    { icon: Pill, label: 'Médicaments', color: 'from-purple-500 to-pink-600', path: '/doctor/order-medications' },
                    { icon: Eye, label: 'Dossier complet', color: 'from-indigo-500 to-purple-600', action: () => toast.info('Dossier ouvert') },
                  ].map((action, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => action.path ? navigate(action.path) : action.action()}
                      className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white font-semibold shadow-xl flex flex-col items-center gap-2`}
                    >
                      <action.icon className="w-8 h-8" />
                      <span className="text-sm">{action.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-3 bg-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition">
                    <Download className="w-5 h-5" /> Exporter PDF
                  </button>
                  <button className="flex-1 py-3 bg-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition">
                    <Share2 className="w-5 h-5" /> Partager
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-800 to-blue-900 rounded-3xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6">Nouveau Patient</h3>
              <div className="space-y-4">
                {[
                  { label: 'Nom complet', key: 'fullName', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Téléphone', key: 'phone', type: 'tel' },
                  { label: 'Date de naissance', key: 'dob', type: 'date' },
                  { label: 'Adresse', key: 'address', type: 'text' },
                ].map((field) => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={field.label}
                    value={newPatient[field.key]}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                ))}
                <div className="flex gap-4">
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
                    className="flex-1 px-4 py-3 bg-white/10 rounded-xl"
                  >
                    <option value="">Genre</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Groupe sanguin"
                    value={newPatient.bloodType}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, bloodType: e.target.value }))}
                    className="flex-1 px-4 py-3 bg-white/10 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddPatient}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-semibold"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-white/10 rounded-xl"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorPatients;