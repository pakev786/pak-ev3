'use client'

import { useState, useEffect } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';


interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;

}

type BranchFormData = Omit<Branch, 'id'>;

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface BranchApiResponse extends ApiResponse {
  data: {
    id: string;
  };
}


export default function BranchesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/admin/login');
    }
    fetchBranches();
  }, [status]);

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      const result: ApiResponse<any[]> = await response.json();
      if (result.success && result.data) {
        // Map _id to id for frontend usage
        const branches = result.data.map((branch: any) => ({
          ...branch,
          id: branch._id,
        }));
        setBranches(branches);
      } else {
        throw new Error(result.error || 'Failed to fetch branches');
      }
    } catch (error: any) {
      console.error('Error fetching branches:', error);
      setError(error.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };



  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/branches/${id}`, {
        method: 'DELETE',
      });
      const result: ApiResponse = await response.json();
      if (response.ok && result.success) {
        setBranches(branches.filter(branch => branch.id !== id));
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to delete branch');
      }
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      setError(error.message || 'Failed to delete branch');
      alert(error.message || 'Failed to delete branch');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    

    const newBranchData: BranchFormData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,

    };
    
    if (!newBranchData.name || !newBranchData.address || !newBranchData.phone || !newBranchData.email) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBranchData),
      });

      const result: BranchApiResponse = await response.json();
      
      if (response.ok && result.success) {
        const newBranch: Branch = { ...newBranchData, id: result.data.id };
        setBranches([...branches, newBranch]);
        setIsAddModalOpen(false);
        form.reset();
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to create branch');
      }
    } catch (error: any) {
      console.error('Error creating branch:', error);
      setError(error.message || 'Failed to create branch');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Manage Branches</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Add New Branch
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {branches.map((branch) => (
                  <tr key={branch.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{branch.phone}</div>
                      <div className="text-gray-500">{branch.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setPendingDeleteId(branch.id);
                          setConfirmOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => router.push(`/admin/branches/${branch.id}/edit`)}
                        className="text-primary hover:text-primary/90 mr-4"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900">Add New Branch</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Branch Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>


              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Add Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Branch"
        message="Are you sure you want to delete this branch? This action cannot be undone."
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={() => {
          if (pendingDeleteId) handleDelete(pendingDeleteId);
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}
