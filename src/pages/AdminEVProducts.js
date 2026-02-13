import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar'; 

export default function AdminEVProducts() {
  const [activeTab, setActiveTab] = useState('ev'); 
  const [products, setProducts] = useState([]);
  const [selectedEVProductIds, setSelectedEVProductIds] = useState([]);
  const [selectedLoadProductIds, setSelectedLoadProductIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300?text=No+Image';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const prodRes = await axios.get(`${BASE_URL}/api/products?limit=1000`);
      const allProducts = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.products || []);
      setProducts(allProducts);

      try {
        const evConfigRes = await axios.get(`${BASE_URL}/api/ev/featured-products`);
        const evRawData = evConfigRes.data;
        const evIds = Array.isArray(evRawData) 
            ? evRawData.map(p => (typeof p === 'object' ? (p._id || p.id) : p))
            : [];
            
        setSelectedEVProductIds(evIds);
      } catch (err) {
        console.warn("Could not fetch existing EV config, starting fresh.");
      }

      try {
        const loadConfigRes = await axios.get(`${BASE_URL}/api/ev/load-featured-products`);
        const loadRawData = loadConfigRes.data;
        const loadIds = Array.isArray(loadRawData) 
            ? loadRawData.map(p => (typeof p === 'object' ? (p._id || p.id) : p))
            : [];
            
        setSelectedLoadProductIds(loadIds);
      } catch (err) {
        console.warn("Could not fetch existing load config, starting fresh.");
      }

    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEVProduct = (productId) => {
    setSelectedEVProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleToggleLoadProduct = (productId) => {
    setSelectedLoadProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSaveEV = async () => {
    setSaving(true);
    try {
      await axios.post(`${BASE_URL}/api/ev/featured-products`, {
        productIds: selectedEVProductIds
      });
      alert('EV Calculator products updated successfully!');
    } catch (error) {
      console.error("Failed to save EV:", error);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLoad = async () => {
    setSaving(true);
    try {
      await axios.post(`${BASE_URL}/api/ev/load-featured-products`, {
        productIds: selectedLoadProductIds
      });
      alert('Load Calculator products updated successfully!');
    } catch (error) {
      console.error("Failed to save load:", error);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{activeTab === 'ev' ? 'EV' : 'Load'} Calculator Configuration</h1>
          {(activeTab === 'ev' || activeTab === 'load') && (
            <button 
              onClick={activeTab === 'ev' ? handleSaveEV : handleSaveLoad}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        <div className="flex space-x-4 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('ev')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'ev' 
                ? 'border-b-4 border-orange-500 text-orange-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            EV Calculator Products
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'load' 
                ? 'border-b-4 border-orange-500 text-orange-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Load Calculator
          </button>
        </div>

      {activeTab === 'ev' && (
          <div>
            <p className="mb-4 text-gray-600">
              Select products below to recommend in the EV Calculator ({selectedEVProductIds.length} selected).
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const pId = product.id || product._id;
                const isSelected = selectedEVProductIds.includes(pId);
                return (
                  <div 
                    key={pId}
                    onClick={() => handleToggleEVProduct(pId)}
                    className={`
                      relative cursor-pointer border-2 rounded-lg overflow-hidden bg-white shadow-sm transition-all
                      ${isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        readOnly
                        className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                      />
                    </div>

                    <img 
  src={getImageUrl(product.image)} 
  alt={product.title} 
  className="w-full h-40 object-cover"
  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Error+Loading'; }}
/>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 line-clamp-1" title={product.title}>{product.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-orange-600 font-bold">Rs. {product.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 capitalize">{product.category?.name || 'Product'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'load' && (
          <div>
            <p className="mb-4 text-gray-600">
              Select products below to recommend in the Load Calculator ({selectedLoadProductIds.length} selected).
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const pId = product.id || product._id;
                const isSelected = selectedLoadProductIds.includes(pId);
                return (
                  <div 
                    key={pId}
                    onClick={() => handleToggleLoadProduct(pId)}
                    className={`
                      relative cursor-pointer border-2 rounded-lg overflow-hidden bg-white shadow-sm transition-all
                      ${isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        readOnly
                        className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                      />
                    </div>

                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-40 object-cover"
                    />
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 line-clamp-1" title={product.title}>{product.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-orange-600 font-bold">Rs. {product.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 capitalize">{product.category?.name || 'Product'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}