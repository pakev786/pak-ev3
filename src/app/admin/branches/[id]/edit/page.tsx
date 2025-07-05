'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';


interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;

}

type BranchFormData = Omit<Branch, 'id'>;


export default function EditBranchPage() {
  const router = useRouter();
  // Robust id extraction from useParams (fixed by Cascade)
  const params = useParams();
  let id = params && typeof params === "object" ? params.id : undefined;
  if (Array.isArray(id)) id = id[0];

  const { data: session, status } = useSession();

  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      const fetchBranch = async () => {
        try {
          const response = await fetch(`/api/branches/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch branch data');
          }
          const data = await response.json();
          setBranch(data);

        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBranch();
    }
  }, [id]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (branch) {
      setBranch({ ...branch, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!branch) return;

    try {
      const response = await fetch(`/api/branches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branch),
      });

      if (!response.ok) {
        throw new Error('Failed to update branch');
      }

      router.push('/admin/branches');
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  if (!branch) return <div className="flex justify-center items-center h-screen">Branch not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Branch</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Branch Name</label>
            <input type="text" id="name" name="name" value={branch.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea id="address" name="address" value={branch.address} onChange={handleChange} rows={3} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" id="phone" name="phone" value={branch.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" value={branch.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => router.back()} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-primary/90">
              Update Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
