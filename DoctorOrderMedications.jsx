// src/pages/DoctorOrderMedications.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search, ShoppingCart, Plus, Minus, Trash2, Truck, Clock, CheckCircle,
  AlertCircle, Package, Filter, ChevronRight, Send
} from 'lucide-react';

const DoctorOrderMedications = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Médicaments simulés
  useEffect(() => {
    setTimeout(() => {
      setMedicines([
        { id: 1, name: 'Paracétamol 500mg', form: 'Comprimé', price: 1500, stock: 200, category: 'analgesique' },
        { id: 2, name: 'Amoxicilline 1g', form: 'Gélule', price: 8500, stock: 80, category: 'antibiotique' },
        { id: 3, name: 'Ibuprofène 400mg', form: 'Comprimé', price: 3200, stock: 150, category: 'analgesique' },
        { id: 4, name: 'Oméprazole 20mg', form: 'Gélule', price: 12000, stock: 60, category: 'gastro' },
        { id: 5, name: 'Metformine 500mg', form: 'Comprimé', price: 4500, stock: 120, category: 'diabete' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredMeds = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || m.category === filter;
    return matchesSearch && matchesFilter;
  });

  const addToCart = (med) => {
    const existing = cart.find(i => i.id === med.id);
    if (existing) {
      setCart(prev => prev.map(i => i.id === med.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart(prev => [...prev, { ...med, qty: 1 }]);
    }
    toast.success(`${med.name} ajouté au panier`);
  };

  const updateQty = (id, qty) => {
    if (qty === 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error('Panier vide');
      return;
    }
    toast.success('Commande envoyée aux pharmacies partenaires !');
    setCart([]);
    setShowCart(false);
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
            Commander des Médicaments
          </h1>
          <p className="text-gray-300 text-lg">Approvisionnement rapide et sécurisé</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Catalogue */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un médicament..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="all">Toutes catégories</option>
                <option value="analgesique">Analgésiques</option>
                <option value="antibiotique">Antibiotiques</option>
                <option value="gastro">Gastro</option>
                <option value="diabete">Diabète</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeds.map((med, i) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-teal-400 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <Package className="w-8 h-8 text-teal-400" />
                    <span className={`px-2 py-1 rounded-full text-xs ${med.stock > 50 ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {med.stock} en stock
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{med.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">{med.form}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">{med.price.toLocaleString()} FCFA</p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(med)}
                      className="p-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Panier */}
          <div className="lg:w-96">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-24"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-teal-400" /> Panier ({cart.length})
                </h3>
                <button
                  onClick={() => setShowCart(true)}
                  className="text-teal-400 hover:text-teal-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="bg-white/5 p-3 rounded-lg flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.price.toLocaleString()} FCFA</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="p-1 rounded-full bg-white/10 hover:bg-white/20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="p-1 rounded-full bg-white/10 hover:bg-white/20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="border-t border-white/20 mt-4 pt-4">
                    <p className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{total.toLocaleString()} FCFA</span>
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={placeOrder}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Truck className="w-5 h-5" /> Commander
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Panier détaillé */}
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
              <h3 className="text-2xl font-bold mb-6">Récapitulatif</h3>
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.qty}</span>
                    <span>{(item.price * item.qty).toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <p className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{total.toLocaleString()} FCFA</span>
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={placeOrder}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-bold"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowCart(false)}
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

export default DoctorOrderMedications;