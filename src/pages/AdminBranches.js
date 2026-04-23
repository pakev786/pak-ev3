import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import axios from 'axios';

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ city: '', holder: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use your backend URL
   const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const API_URL = `${BASE_URL}/api/branches`;

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(API_URL);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ city: '', holder: '', phone: '', address: '' });
      setEditingId(null);
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Failed to save branch.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setEditingId(branch._id);
    setFormData({
      city: branch.city,
      holder: branch.holder,
      phone: branch.phone,
      address: branch.address,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Failed to delete branch.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ city: '', holder: '', phone: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar active="branches" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Branches</h1>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Branch' : 'Add New Branch'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Lahore" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input type="text" name="holder" value={formData.holder} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Mr. Waqas Ali" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. 03312416728" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500" placeholder="Full address" />
            </div>
            
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" disabled={loading} className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600 transition disabled:bg-orange-300">
                {loading ? 'Saving...' : editingId ? 'Update Branch' : 'Add Branch'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded font-bold hover:bg-gray-600 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Branches Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {branches.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No branches found.</td>
                  </tr>
                ) : (
                  branches.map((branch) => (
                    <tr key={branch._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{branch.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{branch.holder || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{branch.phone}</td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{branch.address || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(branch)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(branch._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBranches;