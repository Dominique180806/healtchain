// /React/src/pages/PharmacyCompleteInfo.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Select from 'react-select';
import logo from '../assets/logo.png';

const PharmacyCompleteInfo = () => {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    licenseNumber: '',
    phoneNumber: '',
    countryCode: '+213', // Par défaut : Algérie
    contactEmail: '',
    openingHours: '',
    address: '',
    country: '',
    region: '',
    files: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || '';

  // Liste des codes pays africains
  const countryCodes = [
    { value: '+213', label: '+213 (Algérie)' },
    { value: '+244', label: '+244 (Angola)' },
    { value: '+229', label: '+229 (Bénin)' },
    { value: '+267', label: '+267 (Botswana)' },
    { value: '+226', label: '+226 (Burkina Faso)' },
    { value: '+257', label: '+257 (Burundi)' },
    { value: '+237', label: '+237 (Cameroun)' },
    { value: '+238', label: '+238 (Cap-Vert)' },
    { value: '+236', label: '+236 (Centrafrique)' },
    { value: '+269', label: '+269 (Comores)' },
    { value: '+242', label: '+242 (Congo)' },
    { value: '+243', label: '+243 (RD Congo)' },
    { value: '+225', label: '+225 (Côte d’Ivoire)' },
    { value: '+253', label: '+253 (Djibouti)' },
    { value: '+20', label: '+20 (Égypte)' },
    { value: '+291', label: '+291 (Érythrée)' },
    { value: '+268', label: '+268 (Eswatini)' },
    { value: '+251', label: '+251 (Éthiopie)' },
    { value: '+241', label: '+241 (Gabon)' },
    { value: '+220', label: '+220 (Gambie)' },
    { value: '+233', label: '+233 (Ghana)' },
    { value: '+224', label: '+224 (Guinée)' },
    { value: '+245', label: '+245 (Guinée-Bissau)' },
    { value: '+240', label: '+240 (Guinée équatoriale)' },
    { value: '+254', label: '+254 (Kenya)' },
    { value: '+266', label: '+266 (Lesotho)' },
    { value: '+231', label: '+231 (Libéria)' },
    { value: '+218', label: '+218 (Libye)' },
    { value: '+261', label: '+261 (Madagascar)' },
    { value: '+265', label: '+265 (Malawi)' },
    { value: '+223', label: '+223 (Mali)' },
    { value: '+212', label: '+212 (Maroc)' },
    { value: '+230', label: '+230 (Maurice)' },
    { value: '+222', label: '+222 (Mauritanie)' },
    { value: '+258', label: '+258 (Mozambique)' },
    { value: '+264', label: '+264 (Namibie)' },
    { value: '+227', label: '+227 (Niger)' },
    { value: '+234', label: '+234 (Nigeria)' },
    { value: '+256', label: '+256 (Ouganda)' },
    { value: '+250', label: '+250 (Rwanda)' },
    { value: '+239', label: '+239 (São Tomé-et-Principe)' },
    { value: '+221', label: '+221 (Sénégal)' },
    { value: '+248', label: '+248 (Seychelles)' },
    { value: '+232', label: '+232 (Sierra Leone)' },
    { value: '+252', label: '+252 (Somalie)' },
    { value: '+249', label: '+249 (Soudan)' },
    { value: '+211', label: '+211 (Soudan du Sud)' },
    { value: '+255', label: '+255 (Tanzanie)' },
    { value: '+235', label: '+235 (Tchad)' },
    { value: '+228', label: '+228 (Togo)' },
    { value: '+216', label: '+216 (Tunisie)' },
    { value: '+260', label: '+260 (Zambie)' },
    { value: '+263', label: '+263 (Zimbabwe)' },
  ];

  // Liste des pays africains
  const countries = [
    { value: 'Algeria', label: 'Algérie' },
    { value: 'Angola', label: 'Angola' },
    { value: 'Benin', label: 'Bénin' },
    { value: 'Botswana', label: 'Botswana' },
    { value: 'Burkina Faso', label: 'Burkina Faso' },
    { value: 'Burundi', label: 'Burundi' },
    { value: 'Cameroon', label: 'Cameroun' },
    { value: 'Cape Verde', label: 'Cap-Vert' },
    { value: 'Central African Republic', label: 'Centrafrique' },
    { value: 'Comoros', label: 'Comores' },
    { value: 'Congo', label: 'Congo' },
    { value: 'DR Congo', label: 'RD Congo' },
    { value: 'Ivory Coast', label: 'Côte d’Ivoire' },
    { value: 'Djibouti', label: 'Djibouti' },
    { value: 'Egypt', label: 'Égypte' },
    { value: 'Eritrea', label: 'Érythrée' },
    { value: 'Eswatini', label: 'Eswatini' },
    { value: 'Ethiopia', label: 'Éthiopie' },
    { value: 'Gabon', label: 'Gabon' },
    { value: 'Gambia', label: 'Gambie' },
    { value: 'Ghana', label: 'Ghana' },
    { value: 'Guinea', label: 'Guinée' },
    { value: 'Guinea-Bissau', label: 'Guinée-Bissau' },
    { value: 'Equatorial Guinea', label: 'Guinée équatoriale' },
    { value: 'Kenya', label: 'Kenya' },
    { value: 'Lesotho', label: 'Lesotho' },
    { value: 'Liberia', label: 'Libéria' },
    { value: 'Libya', label: 'Libye' },
    { value: 'Madagascar', label: 'Madagascar' },
    { value: 'Malawi', label: 'Malawi' },
    { value: 'Mali', label: 'Mali' },
    { value: 'Morocco', label: 'Maroc' },
    { value: 'Mauritius', label: 'Maurice' },
    { value: 'Mauritania', label: 'Mauritanie' },
    { value: 'Mozambique', label: 'Mozambique' },
    { value: 'Namibia', label: 'Namibie' },
    { value: 'Niger', label: 'Niger' },
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Uganda', label: 'Ouganda' },
    { value: 'Rwanda', label: 'Rwanda' },
    { value: 'Sao Tome and Principe', label: 'São Tomé-et-Principe' },
    { value: 'Senegal', label: 'Sénégal' },
    { value: 'Seychelles', label: 'Seychelles' },
    { value: 'Sierra Leone', label: 'Sierra Leone' },
    { value: 'Somalia', label: 'Somalie' },
    { value: 'Sudan', label: 'Soudan' },
    { value: 'South Sudan', label: 'Soudan du Sud' },
    { value: 'Tanzania', label: 'Tanzanie' },
    { value: 'Chad', label: 'Tchad' },
    { value: 'Togo', label: 'Togo' },
    { value: 'Tunisia', label: 'Tunisie' },
    { value: 'Zambia', label: 'Zambie' },
    { value: 'Zimbabwe', label: 'Zimbabwe' },
  ];

  // Initialiser Google Maps Places Autocomplete
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const input = document.getElementById('address-input');
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: countries.map(c => c.value.toLowerCase().substring(0, 2)) }, // Restreindre aux pays africains
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({
            ...prev,
            address: place.formatted_address,
            country: place.address_components?.find(comp => comp.types.includes('country'))?.short_name || '',
            region: place.address_components?.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || '',
          }));
          setErrors(prev => ({ ...prev, address: '', country: '', region: '' }));
        }
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pharmacyName.trim()) newErrors.pharmacyName = 'Le nom de la pharmacie est requis';
    if (!formData.licenseNumber.match(/^[a-zA-Z0-9]{6,}$/))
      newErrors.licenseNumber = 'Numéro de licence invalide (minimum 6 caractères alphanumériques)';
    if (!formData.phoneNumber.match(/^\d{9,10}$/))
      newErrors.phoneNumber = `Numéro de téléphone invalide pour ${formData.countryCode} (9-10 chiffres)`;
    if (!formData.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail))
      newErrors.contactEmail = 'Email de contact invalide';
    if (!formData.openingHours.trim()) newErrors.openingHours = 'Les heures d’ouverture sont requises';
    if (!formData.address.trim()) newErrors.address = 'L’adresse est requise';
    if (!formData.country) newErrors.country = 'Le pays est requis';
    if (!formData.region.trim()) newErrors.region = 'La région est requise';
    if (formData.files.length > 5) newErrors.files = 'Maximum 5 fichiers';
    formData.files.forEach((file) => {
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type))
        newErrors.files = 'Fichiers PDF, JPG ou PNG uniquement';
      if (file.size > 5 * 1024 * 1024) newErrors.files = 'Fichier trop volumineux (max 5 Mo)';
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter((file) =>
      ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024
    );
    setFormData({ ...formData, files: [...formData.files, ...validFiles].slice(0, 5) });
    setErrors({ ...errors, files: '' });
  };

  const removeFile = (index) => {
    setFormData({ ...formData, files: formData.files.filter((_, i) => i !== index) });
  };

  const handleReset = () => {
    setFormData({
      pharmacyName: '',
      licenseNumber: '',
      phoneNumber: '',
      countryCode: '+213',
      contactEmail: '',
      openingHours: '',
      address: '',
      country: '',
      region: '',
      files: [],
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('email', email);
    formDataToSend.append('role', 'pharmacy');
    formDataToSend.append('pharmacyName', formData.pharmacyName);
    formDataToSend.append('licenseNumber', formData.licenseNumber);
    formDataToSend.append('phoneNumber', `${formData.countryCode}${formData.phoneNumber}`);
    formDataToSend.append('contactEmail', formData.contactEmail);
    formDataToSend.append('openingHours', formData.openingHours);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('country', formData.country);
    formDataToSend.append('region', formData.region);
    formData.files.forEach((file) => {
      formDataToSend.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/auth/complete-info', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 2000,
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l’enregistrement', {
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 sm:p-8"
      >
        <motion.img
          src={logo}
          alt="HealthChain Logo"
          className="mx-auto h-16 sm:h-24 mb-6 w-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6"
        >
          Compléter vos informations (Pharmacien)
        </motion.h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la pharmacie</label>
            <input
              type="text"
              name="pharmacyName"
              placeholder="Ex: Pharmacie Centrale"
              value={formData.pharmacyName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.pharmacyName && <p className="text-red-500 text-xs mt-1">{errors.pharmacyName}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de licence</label>
            <input
              type="text"
              name="licenseNumber"
              placeholder="Ex: LIC123456"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
            <div className="flex space-x-2 items-center">
              <Select
                options={countryCodes}
                value={countryCodes.find(code => code.value === formData.countryCode)}
                onChange={(selected) => {
                  setFormData({ ...formData, countryCode: selected.value, phoneNumber: '' });
                  setErrors({ ...errors, phoneNumber: '' });
                }}
                className="w-[120px]"
                classNamePrefix="react-select"
                placeholder="+..."
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Ex: 123456789"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
            <input
              type="email"
              name="contactEmail"
              placeholder="Ex: contact@pharmacie.com"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Heures d’ouverture</label>
            <input
              type="text"
              name="openingHours"
              placeholder="Ex: Lun-Ven : 8h-18h, Sam : 8h-12h"
              value={formData.openingHours}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.openingHours && <p className="text-red-500 text-xs mt-1">{errors.openingHours}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse (sélectionnez ou entrez manuellement)</label>
            <input
              id="address-input"
              type="text"
              name="address"
              placeholder="Ex: 123 Rue Principale, Alger, Algérie"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <Select
              options={countries}
              value={countries.find(country => country.value === formData.country)}
              onChange={(selected) => {
                setFormData({ ...formData, country: selected.value });
                setErrors({ ...errors, country: '' });
              }}
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Sélectionner un pays"
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <input
              type="text"
              name="region"
              placeholder="Ex: Alger"
              value={formData.region}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificats/Diplômes (PDF, JPG, PNG, max 5 Mo)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              multiple
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {formData.files.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.files && <p className="text-red-500 text-xs mt-1">{errors.files}</p>}
          </motion.div>
          <div className="md:col-span-2 flex space-x-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              type="submit"
              disabled={loading}
              className={`flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition duration-300 font-semibold"
            >
              Annuler
            </motion.button>
          </div>
        </form>
        <footer className="mt-8 text-center text-sm text-gray-500">
          <div className="flex justify-center items-center space-x-3">
            <img src={logo} alt="HealthChain Logo" className="h-8 w-auto" />
            <p className="font-medium">Propulsé par HealthChain Trace &copy; 2025</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default PharmacyCompleteInfo;