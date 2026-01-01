import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminAccounts() {
  // WhatsApp State
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  // Admin Email State
  const [adminEmail, setAdminEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  // Bank Accounts State
  const [accounts, setAccounts] = useState([]);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    iban: ''
  });
  const [bankLoading, setBankLoading] = useState(false);

  const SETTINGS_API = `${BASE_URL}/api/settings`;
  const BANKS_API = `${BASE_URL}/api/banks`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [waRes, emailRes, banksRes] = await Promise.all([
        axios.get(`${SETTINGS_API}/whatsapp`),
        axios.get(`${SETTINGS_API}/email`),
        axios.get(BANKS_API)
      ]);
      setWhatsappNumber(waRes.data.number || '');
      setAdminEmail(emailRes.data.email || '');
      setAccounts(banksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // --- Handlers ---
  const handleWhatsappSave = async (e) => {
    e.preventDefault();
    setWhatsappLoading(true);
    try {
      await axios.put(`${SETTINGS_API}/whatsapp`, { number: whatsappNumber });
      alert('WhatsApp number updated successfully!');
    } catch (error) {
      alert('Failed to update WhatsApp number');
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleEmailSave = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await axios.put(`${SETTINGS_API}/email`, { email: adminEmail });
      alert('Admin email updated successfully!');
    } catch (error) {
      alert('Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleBankInput = (e) => {
    setBankForm({ ...bankForm, [e.target.name]: e.target.value });
  };

  const handleBankAdd = async (e) => {
    e.preventDefault();
    if (!bankForm.bankName || !bankForm.accountNumber) return;
    
    setBankLoading(true);
    try {
      const res = await axios.post(BANKS_API, bankForm);
      setAccounts([...accounts, res.data]);
      setBankForm({ bankName: '', accountHolderName: '', accountNumber: '', iban: '' }); 
    } catch (error) {
      alert('Failed to add bank account');
    } finally {
      setBankLoading(false);
    }
  };

  const handleBankDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await axios.delete(`${BANKS_API}/${id}`);
      setAccounts(accounts.filter(acc => acc.id !== id));
    } catch (error) {
      alert('Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <AdminNavbar active="accounts" />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Accounts & Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* 1. WhatsApp Configuration */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </div>
                    <div>
                    <h2 className="text-xl font-bold text-gray-900">WhatsApp</h2>
                    <p className="text-sm text-gray-500">Contact number for customers.</p>
                    </div>
                </div>
                <form onSubmit={handleWhatsappSave} className="flex gap-2">
                    <input 
                    type="text" 
                    placeholder="e.g. 923001234567" 
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <button type="submit" disabled={whatsappLoading} className="px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">Save</button>
                </form>
            </div>

            {/* 2. Admin Email Configuration */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                    <h2 className="text-xl font-bold text-gray-900">Admin Email</h2>
                    <p className="text-sm text-gray-500">Receive order notifications here.</p>
                    </div>
                </div>
                <form onSubmit={handleEmailSave} className="flex gap-2">
                    <input 
                    type="email" 
                    placeholder="admin@pakev.com" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button type="submit" disabled={emailLoading} className="px-4 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition">Save</button>
                </form>
            </div>
        </div>

        {/* --- 3. Bank Accounts --- */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bank Accounts</h2>
              <p className="text-sm text-gray-500">Manage payment accounts shown to customers.</p>
            </div>
          </div>

          <form onSubmit={handleBankAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bank Name</label>
              <input name="bankName" value={bankForm.bankName} onChange={handleBankInput} className="w-full p-3 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Meezan Bank" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Holder</label>
              <input name="accountHolderName" value={bankForm.accountHolderName} onChange={handleBankInput} className="w-full p-3 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Pak EV Pvt Ltd" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
              <input name="accountNumber" value={bankForm.accountNumber} onChange={handleBankInput} className="w-full p-3 border border-gray-300 rounded-lg outline-none" placeholder="e.g. 0101010101" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">IBAN (Optional)</label>
              <input name="iban" value={bankForm.iban} onChange={handleBankInput} className="w-full p-3 border border-gray-300 rounded-lg outline-none" placeholder="PK00 MEZN..." />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={bankLoading} className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition">
                {bankLoading ? 'Adding...' : '+ Add Bank Account'}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {accounts.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No bank accounts added yet.</p>
            ) : (
              accounts.map(acc => (
                <div key={acc.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white">
                  <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-900">{acc.bankName}</h3>
                    <p className="text-gray-600">{acc.accountHolderName}</p>
                    <p className="text-sm font-mono text-gray-500">{acc.accountNumber}</p>
                    {acc.iban && <p className="text-xs text-gray-400 mt-1">IBAN: {acc.iban}</p>}
                  </div>
                  <button 
                    onClick={() => handleBankDelete(acc.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}