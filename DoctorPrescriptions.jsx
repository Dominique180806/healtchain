// src/pages/DoctorPrescriptions.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Search, Plus, Trash2, Download, Send, Clock, Pill, Calendar, User, AlertCircle,
  ChevronDown, Check, X, Edit, FileText, Stethoscope, Shield, Printer
} from 'lucide-react';

const DoctorPrescriptions = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPatient, setSearchPatient] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [searchMed, setSearchMed] = useState('');
  const [prescription, setPrescription] = useState({
    patientId: '',
    items: [],
    notes: '',
    duration: '7',
    renewable: false,
    renewableTimes: 1
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Médicaments simulés (remplacer par API réelle)
  const allMedicines = [
    { id: 1, name: 'Paracétamol 500mg', form: 'Comprimé', dosage: '500mg', stock: 150 },
    { id: 2, name: 'Amoxicilline 1g', form: 'Gélule', dosage: '1g', stock: 80 },
    { id: 3, name: 'Ibuprofène 400mg', form: 'Comprimé', dosage: '400mg', stock: 200 },
    { id: 4, name: 'Doliprane 1000mg', form: 'Comprimé effervescent', dosage: '1000mg', stock: 90 },
    { id: 5, name: 'Augmentin 1g', form: 'Comprimé', dosage: '1g', stock: 60 },
  ];

  // Patients simulés
  useEffect(() => {
    setTimeout(() => {
      setPatients([
        { id: 1, fullName: 'Marie Dupont', email: 'marie.dupont@email.com', phone: '+225 01 23 45 67', dob: '1990-05-15' },
        { id: 2, fullName: 'Jean Koffi', email: 'jean.koffi@email.com', phone: '+225 07 89 01 23', dob: '1985-11-30' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.email.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const filteredMeds = allMedicines.filter(m =>
    m.name.toLowerCase().includes(searchMed.toLowerCase())
  );

  const addMedicine = (med) => {
    if (prescription.items.find(i => i.id === med.id)) {
      toast.info('Médicament déjà ajouté');
      return;
    }
    setPrescription(prev => ({
      ...prev,
      items: [...prev.items, {
        ...med,
        posology: '1 comprimé',
        frequency: 'matin et soir',
        duration: '7 jours',
        quantity: 14
      }]
    }));
    setSearchMed('');
  };

  const updateItem = (id, field, value) => {
    setPrescription(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (id) => {
    setPrescription(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const generatePrescription = () => {
    if (!selectedPatient) {
      toast.error('Sélectionnez un patient');
      return;
    }
    if (prescription.items.length === 0) {
      toast.error('Ajoutez au moins un médicament');
      return;
    }
    setShowPreview(true);
  };

  const sendPrescription = () => {
    toast.success('Ordonnance envoyée à la pharmacie !');
    setShowPreview(false);
    // Réinitialiser
    setPrescription({
      patientId: '',
      items: [],
      notes: '',
      duration: '7',
      renewable: false,
      renewableTimes: 1
    });
    setSelectedPatient(null);
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Écrire une Ordonnance
          </h1>
          <p className="text-gray-300 text-lg">Sécurisée, traçable, et instantanément délivrée</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne 1: Sélection Patient */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-teal-400" /> Patient
              </h3>

              {selectedPatient ? (
                <div className="bg-gradient-to-r from-teal-500/20 to-blue-600/20 p-4 rounded-xl border border-teal-400">
                  <p className="font-bold text-lg">{selectedPatient.fullName}</p>
                  <p className="text-sm text-gray-300">{selectedPatient.email}</p>
                  <p className="text-sm text-gray-300">{selectedPatient.phone}</p>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="mt-3 text-xs text-red-400 hover:text-red-300"
                  >
                    Changer
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un patient..."
                      value={searchPatient}
                      onChange={(e) => setSearchPatient(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredPatients.map(patient => (
                      <motion.div
                        key={patient.id}
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPrescription(prev => ({ ...prev, patientId: patient.id }));
                          setSearchPatient('');
                        }}
                        className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition"
                      >
                        <p className="font-medium">{patient.fullName}</p>
                        <p className="text-xs text-gray-400">{patient.email}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Colonne 2: Médicaments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Recherche Médicament */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Pill className="w-6 h-6 text-blue-400" /> Médicaments
              </h3>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un médicament..."
                  value={searchMed}
                  onChange={(e) => setSearchMed(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {filteredMeds.map(med => (
                  <motion.div
                    key={med.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => addMedicine(med)}
                    className="p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition border border-white/10"
                  >
                    <p className="font-medium">{med.name}</p>
                    <p className="text-xs text-gray-400">{med.form} • {med.dosage}</p>
                    <p className="text-xs text-green-400 mt-1">Stock: {med.stock}</p>
                  </motion.div>
                ))}
              </div>

              {/* Liste des médicaments ajoutés */}
              <div className="space-y-3">
                {prescription.items.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-r from-blue-600/20 to-teal-600/20 p-4 rounded-xl border border-white/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold">{item.name}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Posologie"
                            value={item.posology}
                            onChange={(e) => updateItem(item.id, 'posology', e.target.value)}
                            className="px-3 py-1 bg-white/10 rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Fréquence"
                            value={item.frequency}
                            onChange={(e) => updateItem(item.id, 'frequency', e.target.value)}
                            className="px-3 py-1 bg-white/10 rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Durée"
                            value={item.duration}
                            onChange={(e) => updateItem(item.id, 'duration', e.target.value)}
                            className="px-3 py-1 bg-white/10 rounded text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Qté"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                            className="px-3 py-1 bg-white/10 rounded text-sm"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-3 p-2 rounded-full bg-red-600/20 hover:bg-red-600/40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {prescription.items.length === 0 && (
                <p className="text-center text-gray-400 py-8">Aucun médicament ajouté</p>
              )}
            </div>

            {/* Notes & Options */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-green-400" /> Notes & Options
              </h3>

              <textarea
                placeholder="Notes supplémentaires pour le pharmacien..."
                value={prescription.notes}
                onChange={(e) => setPrescription(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-4 bg-white/10 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <div className="flex items-center gap-6 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prescription.renewable}
                    onChange={(e) => setPrescription(prev => ({ ...prev, renewable: e.target.checked }))}
                    className="w-5 h-5 rounded accent-teal-400"
                  />
                  <span>Renouvelable</span>
                </label>
                {prescription.renewable && (
                  <select
                    value={prescription.renewableTimes}
                    onChange={(e) => setPrescription(prev => ({ ...prev, renewableTimes: e.target.value }))}
                    className="px-4 py-2 bg-white/10 rounded-lg"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} fois</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generatePrescription}
                className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3"
              >
                <FileText className="w-6 h-6" /> Générer l'ordonnance
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 bg-white/10 rounded-2xl flex items-center gap-2"
              >
                <Printer className="w-5 h-5" /> Imprimer
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Aperçu Ordonnance */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-600">Ordonnance Médicale</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="font-bold text-lg">Dr. {localStorage.getItem('email')?.split('@')[0]}</p>
                    <p className="text-sm text-gray-600">Médecin généraliste</p>
                    <p className="text-sm text-gray-600">+225 00 00 00 00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Date: {format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
                    <p className="text-sm">N° Ordonnance: ORD-{Date.now().toString().slice(-6)}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="font-bold">Patient:</p>
                  <p className="text-lg">{selectedPatient.fullName}</p>
                  <p className="text-sm text-gray-600">{selectedPatient.email} • {selectedPatient.phone}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {prescription.items.map(item => (
                    <div key={item.id} className="border-b pb-3">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm">
                        {item.posology} - {item.frequency} - {item.duration} ({item.quantity} unités)
                      </p>
                    </div>
                  ))}
                </div>

                {prescription.notes && (
                  <div className="mb-8">
                    <p className="font-bold">Notes:</p>
                    <p className="text-sm italic">{prescription.notes}</p>
                  </div>
                )}

                {prescription.renewable && (
                  <p className="text-sm text-red-600 font-bold">
                    Renouvelable {prescription.renewableTimes} fois
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Signée numériquement via HealthChain</span>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-gray-100 rounded-xl flex items-center gap-2 hover:bg-gray-200">
                    <Download className="w-5 h-5" /> PDF
                  </button>
                  <button
                    onClick={sendPrescription}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" /> Envoyer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorPrescriptions;