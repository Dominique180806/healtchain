// src/pages/DoctorPharmacies.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search, MessageCircle, Send, Users, MapPin, Phone, Clock, CheckCircle,
  AlertCircle, Share2, FileText, Stethoscope, Package
} from 'lucide-react';

const DoctorPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharma, setSelectedPharma] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setPharmacies([
        { id: 1, name: 'Pharmacie Centrale', address: 'Abidjan, Plateau', phone: '+225 20 21 22 23', status: 'online', responseTime: '2h' },
        { id: 2, name: 'Pharmacie du Lac', address: 'Abidjan, Cocody', phone: '+225 22 44 55 66', status: 'online', responseTime: '1h' },
        { id: 3, name: 'Pharmacie Populaire', address: 'Yamoussoukro', phone: '+225 30 60 70 80', status: 'offline', responseTime: '4h' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPharma = pharmacies.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedPharma) return;
    const msg = { text: newMessage, from: 'doctor', time: new Date().toLocaleTimeString() };
    setMessages(prev => ({
      ...prev,
      [selectedPharma.id]: [...(prev[selectedPharma.id] || []), msg]
    }));
    setNewMessage('');
    toast.success('Message envoyé');
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Collaborer avec les Pharmacies
          </h1>
          <p className="text-gray-300 text-lg">Communication instantanée et traçable</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des pharmacies */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une pharmacie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="space-y-3">
                {filteredPharma.map(pharma => (
                  <motion.div
                    key={pharma.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedPharma(pharma)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedPharma?.id === pharma.id ? 'bg-teal-500/20 border border-teal-400' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{pharma.name}</p>
                        <p className="text-sm text-gray-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {pharma.address}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${pharma.status === 'online' ? 'bg-green-400' : 'bg-gray-500'}`} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Réponse: {pharma.responseTime}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            {selectedPharma ? (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl h-full flex flex-col"
                style={{ minHeight: '600px' }}
              >
                <div className="p-6 border-b border-white/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl font-bold">{selectedPharma.name}</p>
                      <p className="text-sm text-gray-300">{selectedPharma.phone}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-3 rounded-full bg-white/10 hover:bg-white/20">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-3 rounded-full bg-white/10 hover:bg-white/20">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {(messages[selectedPharma.id] || []).map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.from === 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                          msg.from === 'doctor' ? 'bg-teal-500 text-white' : 'bg-white/10'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-white/20">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Écrivez un message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 px-4 py-3 bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={sendMessage}
                      className="p-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center">
                <Users className="w-20 h-20 mx-auto text-gray-600 mb-4" />
                <p className="text-xl text-gray-400">Sélectionnez une pharmacie pour commencer</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FileText, label: 'Partager une ordonnance', color: 'from-green-500 to-emerald-600' },
            { icon: Package, label: 'Suivi de commande', color: 'from-blue-500 to-indigo-600' },
            { icon: Stethoscope, label: 'Demande d’avis', color: 'from-purple-500 to-pink-600' },
          ].map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r ${action.color} p-6 rounded-2xl shadow-xl text-center cursor-pointer"
            >
              <action.icon className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold">{action.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorPharmacies;