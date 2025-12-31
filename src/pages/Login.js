import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function Login() {
  // Modes: 'login', 'forgot', 'reset'
  const [view, setView] = useState('login'); 
  const [formData, setFormData] = useState({ email: '', password: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Password Validation State
  const [passConstraints, setPassConstraints] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });

  const navigate = useNavigate();
  const { loginUser } = useCart();
  const BASE_URL = 'http://localhost:5000/api/auth';

  // --- Password Helpers ---
  const validatePassword = (pass) => {
    const checks = {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };
    setPassConstraints(checks);
    return Object.values(checks).every(Boolean);
  };

  const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    // Ensure at least one of each required type
    pass += "A"; // Upper
    pass += "1"; // Number
    pass += "!"; // Special
    pass += "abcdefg"; // Padding length

    // Shuffle and fill rest randomly
    for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Simple shuffle logic or just append randoms
    const finalPass = pass.split('').sort(() => 0.5 - Math.random()).join('').slice(0, 12);
    
    setFormData({ ...formData, newPassword: finalPass });
    validatePassword(finalPass);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'newPassword') validatePassword(value);
  };

  // --- Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${BASE_URL}/login`, { 
        email: formData.email, 
        password: formData.password 
      });
      loginUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post(`${BASE_URL}/forgot-password`, { email: formData.email });
      setView('reset');
      setSuccessMsg(`OTP sent to ${formData.email}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.newPassword)) {
        setError("Password does not meet requirements.");
        return;
    }
    setLoading(true); setError('');
    try {
      await axios.post(`${BASE_URL}/reset-password`, { 
        email: formData.email, 
        otp: formData.otp, 
        newPassword: formData.newPassword 
      });
      alert("Password reset successfully! Please login.");
      setView('login');
      setFormData({ ...formData, password: '', otp: '', newPassword: '' });
      setSuccessMsg('');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {view === 'login' ? 'Welcome Back' : view === 'forgot' ? 'Reset Password' : 'New Password'}
            </h1>
            <p className="text-gray-500 mt-2">
              {view === 'login' ? 'Log in to your Pak EV account' : 'Secure your account'}
            </p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
          {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm text-center">{successMsg}</div>}

          {/* VIEW: LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <button type="button" onClick={() => setView('forgot')} className="text-xs text-orange-600 font-bold hover:underline">Forgot?</button>
                </div>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg disabled:opacity-50">
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          )}

          {/* VIEW: FORGOT (Request OTP) */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotRequest} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Enter your registered email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setView('login')} className="flex-1 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          {/* VIEW: RESET (Verify & Set New) */}
          {view === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Enter OTP</label>
                <input type="text" name="otp" value={formData.otp} onChange={handleInputChange} className="w-full p-3 text-center tracking-widest text-xl border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" maxLength={6} required />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                <div className="relative">
                    <input 
                        type="text" // Shown as text initially so user can copy/see generated pass
                        name="newPassword" 
                        value={formData.newPassword} 
                        onChange={handleInputChange} 
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 pr-24" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={generateStrongPassword}
                        className="absolute right-2 top-2 bottom-2 px-3 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200 text-gray-600"
                    >
                        Generate
                    </button>
                </div>
                
                {/* Password Constraints UI */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <span className={passConstraints.length ? "text-green-600 font-bold" : "text-gray-400"}>✓ 8+ Characters</span>
                    <span className={passConstraints.upper ? "text-green-600 font-bold" : "text-gray-400"}>✓ Uppercase Letter</span>
                    <span className={passConstraints.number ? "text-green-600 font-bold" : "text-gray-400"}>✓ Number</span>
                    <span className={passConstraints.special ? "text-green-600 font-bold" : "text-gray-400"}>✓ Special Char</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg disabled:opacity-50">
                {loading ? 'Resetting...' : 'Set New Password'}
              </button>
            </form>
          )}

          {view === 'login' && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-600 font-bold hover:underline">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}