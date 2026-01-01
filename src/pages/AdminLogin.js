import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  // Check if already logged in and redirect
  useEffect(() => {
    const adminStr = localStorage.getItem('adminUser');
    if (adminStr) {
      navigate('/adminHome');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // First try to init superadmin if DB is empty (dev convenience)
      await axios.post(`${BASE_URL}/api/admin/init`).catch(() => {});
      const res = await axios.post(`${BASE_URL}/api/admin/login`, { username, password });
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      navigate('/adminHome');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Portal</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}