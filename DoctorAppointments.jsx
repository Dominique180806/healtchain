// src/pages/DoctorAppointments.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { listenToRdvMessages } from '../services/hcs-rdv';
import { Check, X } from 'lucide-react';

const DoctorAppointments = () => {
  const [rdvRequests, setRdvRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/login');
      return;
    }

    const unsubscribe = listenToRdvMessages((msg) => {
      if (msg.type === 'RDV_REQUEST' && msg.doctorEmail === email) {
        setRdvRequests(prev => [...prev, { ...msg, id: msg.requestId }]);
        toast.info(`Nouveau RDV de ${msg.patientEmail}`, { autoClose: 5000 });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const respondToRdv = async (requestId, accepted, reason = '') => {
    const doctorEmail = localStorage.getItem('email');
    const request = rdvRequests.find(r => r.requestId === requestId);
    if (!request) return;

    try {
      await axios.post('http://localhost:5000/api/appointments/respond', {
        requestId,
        doctorEmail,
        patientEmail: request.patientEmail,
        accepted,
        reason: accepted ? null : reason
      });

      setRdvRequests(prev => prev.filter(r => r.requestId !== requestId));
      toast.success(accepted ? 'RDV confirmé !' : 'RDV refusé');
    } catch (err) {
      toast.error('Erreur réponse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Demandes de Rendez-vous</h1>

        {rdvRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucune demande en attente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rdvRequests.map((req) => (
              <motion.div
                key={req.requestId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-5 flex justify-between items-center shadow-lg"
              >
                <div>
                  <p className="font-semibold text-lg">{req.patientEmail}</p>
                  <p className="text-sm text-gray-300">
                    {new Date(req.date).toLocaleDateString('fr-FR')} à {req.time}
                  </p>
                  <p className="text-sm text-teal-400 mt-1">Motif: {req.motif}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => respondToRdv(req.requestId, true)}
                    className="bg-green-600 hover:bg-green-700 p-3 rounded-full transition transform hover:scale-110"
                    title="Accepter"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Raison du refus ?');
                      if (reason !== null) respondToRdv(req.requestId, false, reason);
                    }}
                    className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition transform hover:scale-110"
                    title="Refuser"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorAppointments;