import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [permissions, setPermissions] = useState([]);
  
  // SuperAdmin Password Change
  const [superPassword, setSuperPassword] = useState('');

  const AVAILABLE_PERMISSIONS = ['stats', 'categories', 'products', 'orders', 'accounts', 'support', 'vouchers','config'];
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin`);
      setAdmins(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePermissionChange = (perm) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/create`, {
        username: newUsername,
        password: newPassword,
        permissions
      });
      setAdmins([...admins, res.data]);
      setNewUsername('');
      setNewPassword('');
      setPermissions([]);
      alert("Admin created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create admin");
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/${id}`);
      setAdmins(admins.filter(a => a.id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const updateSuperPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/admin/superadmin/password`, { password: superPassword });
      setSuperPassword('');
      alert("SuperAdmin password updated");
    } catch (error) {
      alert("Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <AdminNavbar active="admins" />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Create Admin Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Create New Sub-Admin</h2>
            <form onSubmit={createAdmin} className="space-y-4">
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full p-3 border rounded-xl"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder="Password" 
                className="w-full p-3 border rounded-xl"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-sm text-gray-500 mb-3 uppercase">Allowed Access</p>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_PERMISSIONS.map(perm => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={permissions.includes(perm)}
                        onChange={() => handlePermissionChange(perm)}
                        className="w-4 h-4 text-orange-500 rounded"
                      />
                      <span className="text-sm capitalize">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">Create Admin</button>
            </form>
          </div>

          {/* List Admins */}
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
              <h3 className="font-bold text-orange-800 mb-4">SuperAdmin Settings</h3>
              <form onSubmit={updateSuperPassword} className="flex gap-2">
                <input 
                  type="password" 
                  placeholder="New SuperAdmin Password" 
                  className="flex-1 p-3 border rounded-xl"
                  value={superPassword}
                  onChange={e => setSuperPassword(e.target.value)}
                  required
                />
                <button className="bg-orange-600 text-white px-6 rounded-xl font-bold hover:bg-orange-700">Update</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-4">Existing Admins</h3>
              {admins.length === 0 ? <p className="text-gray-400">No sub-admins found.</p> : (
                <ul className="divide-y divide-gray-100">
                  {admins.map(admin => (
                    <li key={admin.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{admin.username}</p>
                        <p className="text-xs text-gray-500">{admin.permissions.join(', ') || 'No Permissions'}</p>
                      </div>
                      <button onClick={() => deleteAdmin(admin.id)} className="text-red-500 font-bold text-sm hover:underline">Delete</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}