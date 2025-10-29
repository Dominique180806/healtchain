// src/pages/FindPharmacy.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search, MapPin, Phone, Clock, Star, ShoppingCart, Plus, Minus, Trash2,
  Filter, ChevronRight, Package, Truck, Shield
} from 'lucide-react';

const FindPharmacy = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simuler données
  useEffect(() => {
    setTimeout(() => {
      setPharmacies([
        { id: 1, name: 'Pharmacie Centrale', address: 'Plateau, Abidjan', phone: '+225 20 21 22 23', rating: 4.8, open: true, distance: '2.3 km' },
        { id: 2, name: 'Pharmacie du Lac', address: 'Cocody, Abidjan', phone: '+225 22 44 55 66', rating: 4.9, open: true, distance: '1.8 km' },
        { id: 3, name: 'Pharmacie Populaire', address: 'Yopougon, Abidjan', phone: '+225 23 45 67 89', rating: 4.5, open: false, distance: '5.7 km' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPharmacies = pharmacies.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (med) => {
    const existing = cart.find(i => i.id === med.id);
    if (existing) {
      setCart(prev => prev.map(i => i.id === med.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart(prev => [...prev, { ...med, qty: 1 }]);
    }
    toast.success(`${med.name} ajouté !`);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

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
            Trouver une Pharmacie & Commander
          </h1>
          <p className="text-gray-300 text-lg">Médicaments authentiques • Livraison sécurisée • Paiement HBAR</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste Pharmacies */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-24">
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

              <div className="space-y-4">
                {filteredPharmacies.map(pharma => (
                  <motion.div
                    key={pharma.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedPharmacy(pharma);
                      // Simuler catalogue
                      setMedicines([
                        { id: 1, name: 'Paracétamol 500mg', price: 1500, stock: 200 },
                        { id: 2, name: 'Amoxicilline 1g', price: 8500, stock: 80 },
                        { id: 3, name: 'Ibuprofène 400mg', price: 3200, stock: 150 },
                      ]);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedPharmacy?.id === pharma.id ? 'bg-teal-500/20 border border-teal-400' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{pharma.name}</p>
                        <p className="text-sm text-gray-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {pharma.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{pharma.rating}</span>
                        </div>
                        <span className={`text-xs ${pharma.open ? 'text-green-400' : 'text-red-400'}`}>
                          {pharma.open ? 'Ouverte' : 'Fermée'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{pharma.distance} • {pharma.phone}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Catalogue & Panier */}
          <div className="lg:col-span-2">
            {selectedPharmacy ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">{selectedPharmacy.name}</h3>
                    <button
                      onClick={() => setShowCart(true)}
                      className="relative p-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {cart.length}
                        </span>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mb-6">
                    {selectedPharmacy.open ? 'Livraison en 30 min' : 'Disponible demain'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicines.map(med => (
                      <motion.div
                        key={med.id}
                        whileHover={{ y: -5 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-teal-400 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Package className="w-8 h-8 text-teal-400" />
                          <span className="text-xs text-green-400">{med.stock} en stock</span>
                        </div>
                        <h4 className="font-bold">{med.name}</h4>
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-xl font-bold">{med.price.toLocaleString()} FCFA</p>
                          <button
                            onClick={() => addToCart(med)}
                            className="p-2 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center">
                <MapPin className="w-20 h-20 mx-auto text-gray-600 mb-4" />
                <p className="text-xl text-gray-400">Sélectionnez une pharmacie pour voir son catalogue</p>
              </div>
            )}
          </div>
        </div>

        {/* Panier Modal */}
        <AnimatePresence>
          {showCart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCart(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-blue-900 rounded-3xl p-8 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-7 h-7 text-teal-400" /> Panier
                </h3>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.price.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))}
                          className="p-1 rounded-full bg-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center">{item.qty}</span>
                        <button
                          onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}
                          className="p-1 rounded-full bg-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <p className="flex justify-between text-xl font-bold mb-4">
                    <span>Total</span>
                    <span>{total.toLocaleString()} FCFA</span>
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" /> Payer en HBAR
                    </button>
                    <button
                      onClick={() => setShowCart(false)}
                      className="flex-1 py-3 bg-white/10 rounded-xl"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FindPharmacy;