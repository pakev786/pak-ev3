import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucherId, setEditingVoucherId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'fixed',
    value: '',
    applicability: 'all',
    targetId: '',
    minOrderValue: 0,
    isActive: true
  });

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vouchersRes, catsRes, secsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/vouchers`),
        axios.get(`${BASE_URL}/api/categories`),
        axios.get(`${BASE_URL}/api/sections`)
      ]);
      setVouchers(vouchersRes.data);
      setCategories(catsRes.data);
      setSections(secsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (voucher = null) => {
    if (voucher) {
      setEditingVoucherId(voucher.id);
      setFormData({
        code: voucher.code,
        discountType: voucher.discountType,
        value: voucher.value,
        applicability: voucher.applicability,
        targetId: voucher.targetId || '',
        minOrderValue: voucher.minOrderValue,
        isActive: voucher.isActive
      });
    } else {
      setEditingVoucherId(null);
      setFormData({
        code: '',
        discountType: 'fixed',
        value: '',
        applicability: 'all',
        targetId: '',
        minOrderValue: 0,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVoucherId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVoucherId) {
        const res = await axios.put(`${BASE_URL}/api/vouchers/${editingVoucherId}`, formData);
        setVouchers(prev => prev.map(v => v.id === editingVoucherId ? res.data : v));
        alert('Voucher updated successfully!');
      } else {
        const res = await axios.post(`${BASE_URL}/api/vouchers`, formData);
        setVouchers(prev => [res.data, ...prev]);
        alert('Voucher created successfully!');
      }
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      try {
        await axios.delete(`${BASE_URL}/api/vouchers/${id}`);
        setVouchers(prev => prev.filter(v => v.id !== id));
      } catch (error) {
        alert('Failed to delete voucher');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminNavbar active="vouchers" />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Vouchers</h1>
          <button 
            onClick={() => openModal()}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg"
          >
            + Add Voucher
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading vouchers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map(voucher => (
              <div key={voucher.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${voucher.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {voucher.isActive ? 'Active' : 'Inactive'}
                </div>
                
                <div className="mb-4">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Code</span>
                  <p className="text-2xl font-mono font-bold text-orange-600">{voucher.code}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Discount</span>
                    <p>{voucher.discountType === 'fixed' ? `₨ ${voucher.value}` : `${voucher.value}% OFF`}</p>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Scope</span>
                    <p className="capitalize">{voucher.applicability}</p>
                  </div>
                  {voucher.minOrderValue > 0 && (
                    <div className="col-span-2">
                        <span className="block text-xs font-bold text-gray-400 uppercase">Min Order</span>
                        <p>₨ {voucher.minOrderValue}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => openModal(voucher)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition">Edit</button>
                  <button onClick={() => handleDelete(voucher.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition">Delete</button>
                </div>
              </div>
            ))}
            {vouchers.length === 0 && (
                <p className="col-span-3 text-center text-gray-400 py-10">No vouchers created yet.</p>
            )}
          </div>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fade-in-down max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">{editingVoucherId ? 'Edit Voucher' : 'Create Voucher'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Voucher Code</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 uppercase font-mono" placeholder="SUMMER2025" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                    <select name="discountType" value={formData.discountType} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 bg-white">
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Value</label>
                    <input type="number" name="value" value={formData.value} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500" placeholder={formData.discountType === 'fixed' ? '500' : '10'} required />
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Applicable To</label>
                    <select name="applicability" value={formData.applicability} onChange={(e) => setFormData({...formData, applicability: e.target.value, targetId: ''})} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 bg-white">
                      <option value="all">All Products</option>
                      <option value="category">Specific Category</option>
                      <option value="section">Specific Section</option>
                    </select>
                </div>

                {formData.applicability !== 'all' && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Target</label>
                        <select name="targetId" value={formData.targetId} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500 bg-white" required>
                            <option value="">-- Select --</option>
                            {formData.applicability === 'category' ? (
                                categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                            ) : (
                                sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                            )}
                        </select>
                    </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Min Order Value (Optional)</label>
                  <input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500" placeholder="0" />
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
                    <span className="font-bold text-gray-700">Voucher is Active</span>
                </div>

                <div className="flex gap-4 pt-2">
                    <button type="button" onClick={closeModal} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}