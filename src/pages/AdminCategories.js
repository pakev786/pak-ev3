import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [catInputValue, setCatInputValue] = useState('');
  const [isCatInputVisible, setIsCatInputVisible] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const catInputRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const CAT_API_URL = `${BASE_URL}/api/categories`;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (catInputRef.current && !catInputRef.current.contains(event.target)) {
        closeCatInput();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const catRes = await axios.get(CAT_API_URL);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const openCatInput = (e) => {
    e.stopPropagation();
    setEditingCatId(null);
    setCatInputValue('');
    setIsCatInputVisible(true);
  };

  const closeCatInput = () => {
    setIsCatInputVisible(false);
    setCatInputValue('');
    setEditingCatId(null);
  };

  const handleCatEdit = (e, cat) => {
    e.stopPropagation();
    setEditingCatId(cat.id);
    setCatInputValue(cat.name);
    setIsCatInputVisible(true);
  };

  const handleCatDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await axios.delete(`${CAT_API_URL}/${id}`);
        setCategories(prev => prev.filter(c => c.id !== id));
        showMessage('success', 'Category deleted');
      } catch (err) {
        showMessage('error', 'Failed to delete');
      }
    }
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    if (!catInputValue.trim()) return;
    setLoading(true);
    try {
      if (editingCatId) {
        const res = await axios.put(`${CAT_API_URL}/${editingCatId}`, { name: catInputValue });
        setCategories(prev => prev.map(c => c.id === editingCatId ? res.data : c));
      } else {
        const res = await axios.post(CAT_API_URL, { name: catInputValue });
        setCategories(prev => [res.data, ...prev]);
      }
      closeCatInput();
      showMessage('success', editingCatId ? 'Category updated' : 'Category added');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Navbar Status
  const toggleNavbarStatus = async (cat) => {
    const newStatus = !cat.inNavbar;
    
    // Optimistic check on frontend to avoid call if obviously full
    if (newStatus === true) {
      const currentCount = categories.filter(c => c.inNavbar).length;
      if (currentCount >= 3) {
        showMessage('error', 'Max 3 categories allowed in Navbar');
        return;
      }
    }

    try {
      const res = await axios.put(`${CAT_API_URL}/${cat.id}`, { inNavbar: newStatus });
      setCategories(prev => prev.map(c => c.id === cat.id ? res.data : c));
      showMessage('success', newStatus ? 'Added to Navbar' : 'Removed from Navbar');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <AdminNavbar active="categories" />

      <main className="max-w-6xl mx-auto px-4 py-12 relative">
        
        {/* Toast Message */}
        {message.text && (
          <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in ${
            message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            <span>{message.text}</span>
          </div>
        )}

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
              <p className="text-gray-500">Manage categories and select up to 3 for the main navbar</p>
            </div>
            
            <button 
              onClick={openCatInput}
              disabled={isCatInputVisible}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 
                ${isCatInputVisible ? 'bg-gray-300' : 'bg-black text-white hover:bg-orange-600'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>

          {isCatInputVisible && (
            <div ref={catInputRef} className="mb-6 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-orange-500 animate-fade-in-down">
              <h3 className="font-bold mb-3">{editingCatId ? 'Edit Category' : 'New Category'}</h3>
              <form onSubmit={handleCatSubmit} className="flex gap-3">
                <input 
                  autoFocus
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Category Name"
                  value={catInputValue}
                  onChange={e => setCatInputValue(e.target.value)}
                />
                <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg font-bold">Save</button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {categories.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No categories yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className={`p-4 border rounded-xl hover:shadow-md transition flex justify-between items-center group ${cat.inNavbar ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100 hover:bg-white'}`}>
                    <div className="flex items-center gap-3">
                      {/* Navbar Toggle Icon */}
                      <button 
                        onClick={() => toggleNavbarStatus(cat)}
                        className={`p-1 rounded-full transition-colors ${cat.inNavbar ? 'text-orange-500 bg-orange-100' : 'text-gray-300 hover:text-orange-300'}`}
                        title={cat.inNavbar ? "Remove from Navbar" : "Add to Navbar"}
                      >
                        <svg className="w-5 h-5" fill={cat.inNavbar ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                      <span className="font-medium">{cat.name}</span>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleCatEdit(e, cat)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                      <button onClick={() => handleCatDelete(cat.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}