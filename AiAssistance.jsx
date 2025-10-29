// src/pages/AiAssistance.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Send, Bot, User, AlertCircle, Heart, Brain, Activity, Shield, Sparkles,
  Mic, MicOff, Volume2, VolumeX, Copy, Check
} from 'lucide-react';

const AiAssistance = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour ! Je suis HealthIA, votre assistant médical intelligent. Comment puis-je vous aider aujourd'hui ?", sender: 'ai', time: 'Maintenant' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMsg) => {
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "Je comprends votre préoccupation. Pour une fièvre persistante, reposez-vous, hydratez-vous et surveillez votre température. Si elle dépasse 38.5°C pendant plus de 48h, consultez un médecin.",
        "Vos symptômes peuvent indiquer une infection respiratoire. Évitez les lieux publics, portez un masque, et prenez du paracétamol si nécessaire. Un médecin peut confirmer.",
        "La douleur thoracique doit être prise au sérieux. Si elle est intense ou accompagnée d’essoufflement, appelez immédiatement les urgences (117 en Côte d'Ivoire).",
        "Pour votre tension, continuez votre traitement. Mesurez-la 2x/jour. Si >140/90 régulièrement, prenez RDV avec votre cardiologue.",
        "Félicitations pour votre suivi ! Continuez ainsi. Pensez à renouveler votre ordonnance avant la fin du mois."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { id: Date.now(), text: randomResponse, sender: 'ai', time: 'À l\'instant' }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input, sender: 'user', time: 'À l\'instant' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    simulateAIResponse(input);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copié !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white pt-20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            HealthIA - Votre Assistant Médical
          </h1>
          <p className="text-gray-300 text-lg">Conseils personnalisés, sécurisés et instantanés</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Principal */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl h-[70vh] flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-600 rounded-full flex items-center justify-center">
                        <Brain className="w-7 h-7" />
                      </div>
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-lg">HealthIA</p>
                      <p className="text-xs text-green-400">En ligne • Réponse instantanée</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                      {isListening ? <Mic className="w-5 h-5 text-red-400" /> : <MicOff className="w-5 h-5" />}
                    </button>
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                      {isSpeaking ? <Volume2 className="w-5 h-5 text-green-400" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === 'ai' ? 'bg-gradient-to-br from-teal-500 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-pink-600'
                        }`}>
                          {msg.sender === 'ai' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>
                        <div className={`p-4 rounded-2xl ${
                          msg.sender === 'ai' ? 'bg-white/10' : 'bg-gradient-to-r from-purple-500 to-pink-600'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">{msg.time}</span>
                            {msg.sender === 'ai' && (
                              <button
                                onClick={() => copyToClipboard(msg.text, msg.id)}
                                className="ml-2 p-1 rounded hover:bg-white/20"
                              >
                                {copiedId === msg.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Décrivez vos symptômes ou posez une question..."
                    className="flex-1 px-5 py-3 bg-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    className="p-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Conseils */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" /> Conseils Santé
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Heart, text: "Buvez 2L d’eau par jour" },
                  { icon: Activity, text: "Marchez 30 min quotidien" },
                  { icon: Shield, text: "Vaccinez-vous à jour" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <tip.icon className="w-5 h-5 text-teal-400" />
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-red-500/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="font-bold">Urgence ?</h3>
              </div>
              <p className="text-sm mb-3">En cas de symptômes graves :</p>
              <button className="w-full py-2 bg-red-600 rounded-xl font-bold text-sm hover:bg-red-700 transition">
                Appeler les Urgences (117)
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistance;