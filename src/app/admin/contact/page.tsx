"use client";
import React, { useState } from 'react';

const updateContact = async (email: string, phone: string, facebook: string, youtube: string, instagram: string) => {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, phone, facebook, youtube, instagram }),
  });
  return res.ok;
};

export default function AdminContactPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => {
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setFacebook(data.facebook || '');
        setYoutube(data.youtube || '');
        setInstagram(data.instagram || '');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    const ok = await updateContact(email, phone, facebook, youtube, instagram);
    setLoading(false);
    if (ok) setSuccess(true);
    else setError('Failed to update.');
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Update Contact Info</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Phone</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Facebook</label>
          <input
            type="url"
            className="w-full border px-3 py-2 rounded"
            value={facebook}
            onChange={e => setFacebook(e.target.value)}
            placeholder="https://facebook.com/yourpage"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">YouTube</label>
          <input
            type="url"
            className="w-full border px-3 py-2 rounded"
            value={youtube}
            onChange={e => setYoutube(e.target.value)}
            placeholder="https://youtube.com/yourchannel"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Instagram</label>
          <input
            type="url"
            className="w-full border px-3 py-2 rounded"
            value={instagram}
            onChange={e => setInstagram(e.target.value)}
            placeholder="https://instagram.com/yourprofile"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {success && <div className="text-green-600 mt-2">Updated successfully!</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
}
