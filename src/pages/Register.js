import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google'; 
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [passConstraints, setPassConstraints] = useState({
    length: false, upper: false, number: false, special: false
  });

  const navigate = useNavigate();
  const { loginUser } = useCart();
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const API_AUTH = `${BASE_URL}/api/auth`;

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
    let pass = "A1!abcdef";
    for (let i = 0; i < 6; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    const finalPass = pass.split('').sort(() => 0.5 - Math.random()).join('').slice(0, 12);
    setFormData(prev => ({ ...prev, password: finalPass }));
    validatePassword(finalPass);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') validatePassword(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
        setError("Password is too weak. Please meet all requirements.");
        return;
    }
    setLoading(true); setError('');
    try {
      await axios.post(`${API_AUTH}/register`, formData);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${API_AUTH}/verify-otp`, {
        email: formData.email,
        otp
      });
      loginUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login Handler ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google Sign-up Success", tokenResponse);
        const { data } = await axios.post(`${API_AUTH}/google`, {
            access_token: tokenResponse.access_token 
        });
        loginUser(data);
        navigate('/');
      } catch (err) {
        console.error("Backend Google Auth Error:", err);
        setError(err.response?.data?.message || "Google Sign-Up failed on server.");
      }
    },
    onError: (errorResponse) => {
        console.error("Google Login Failed:", errorResponse);
        setError("Google Login Failed.");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2">{step === 1 ? 'Join Pak EV today' : `Verify email: ${formData.email}`}</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

          {step === 1 ? (
            <>
                <form onSubmit={handleRegister} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" required />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleInputChange} 
                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 pr-24" 
                            required 
                        />
                        <button type="button" onClick={generateStrongPassword} className="absolute right-2 top-2 bottom-2 px-3 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200 text-gray-600">Generate</button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <span className={passConstraints.length ? "text-green-600 font-bold" : "text-gray-400"}>✓ 8+ Characters</span>
                        <span className={passConstraints.upper ? "text-green-600 font-bold" : "text-gray-400"}>✓ Uppercase Letter</span>
                        <span className={passConstraints.number ? "text-green-600 font-bold" : "text-gray-400"}>✓ Number</span>
                        <span className={passConstraints.special ? "text-green-600 font-bold" : "text-gray-400"}>✓ Special Char</span>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg disabled:opacity-50">
                    {loading ? 'Sending OTP...' : 'Send OTP to Email'}
                </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign up with</span></div>
                </div>

                <button 
                    onClick={() => googleLogin()}
                    className="w-full py-3 border border-gray-300 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Google
                </button>
            </>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Enter OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 text-center text-2xl tracking-widest border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" maxLength={6} required />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify & Register'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-gray-500 text-sm hover:text-gray-800">Change Email</button>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-orange-600 font-bold hover:underline">Log In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}