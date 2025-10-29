// src/pages/DoctorSchedule.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { listenToRdvMessages } from '../services/hcs-rdv';
import { Check, X, Calendar, Clock, User, AlertCircle } from 'lucide-react';

const DoctorSchedule = () => {
  const [rdvRequests, setRdvRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

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

  const rdvByDate = rdvRequests.reduce((acc, rdv) => {
    const date = rdv.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(rdv);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Planification des RDV</h1>
          <p className="text-gray-300">Gérez vos consultations en toute simplicité</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-gray-400">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {monthDays.map(day => {
                const hasRdv = rdvByDate[format(day, 'yyyy-MM-dd')];
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      p-3 rounded-xl transition-all relative
                      ${isSameDay(day, selectedDate) ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-white/10 hover:bg-white/20'}
                      ${hasRdv ? 'ring-2 ring-teal-400' : ''}
                    `}
                  >
                    {format(day, 'd')}
                    {hasRdv && <div className="absolute top-1 right-1 w-2 h-2 bg-teal-400 rounded-full" />}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Liste des RDV */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-teal-400" />
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </h3>

              {rdvByDate[format(selectedDate, 'yyyy-MM-dd')]?.length > 0 ? (
                <div className="space-y-4">
                  {rdvByDate[format(selectedDate, 'yyyy-MM-dd')].map(rdv => (
                    <motion.div
                      key={rdv.requestId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-blue-600/20 to-teal-600/20 p-5 rounded-xl border border-white/20"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            {rdv.patientEmail}
                          </p>
                          <p className="text-sm flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {rdv.time}
                          </p>
                          <p className="text-sm flex items-center gap-2 mt-2 text-teal-300">
                            <AlertCircle className="w-4 h-4" />
                            {rdv.motif}
                          </p>
                        </div>
                        <div className="flex gap-3 ml-4">
                          <button
                            onClick={() => respondToRdv(rdv.requestId, true)}
                            className="bg-green-600 hover:bg-green-700 p-3 rounded-full transition transform hover:scale-110 shadow-lg"
                            title="Accepter"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Raison du refus ?');
                              if (reason !== null) respondToRdv(rdv.requestId, false, reason);
                            }}
                            className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition transform hover:scale-110 shadow-lg"
                            title="Refuser"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">Aucun RDV prévu ce jour</p>
              )}
            </div>

            {/* Toutes les demandes */}
            {rdvRequests.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Toutes les demandes en attente</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {rdvRequests.map(rdv => (
                    <div key={rdv.requestId} className="bg-white/5 p-3 rounded-lg text-sm">
                      <span className="font-medium">{rdv.patientEmail}</span> - {rdv.date} à {rdv.time}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;