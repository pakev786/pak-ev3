'use client'

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';

interface Post {
  _id: { toString(): string };
  title: string;
  description: string;
  price: string;
  category: 'ev-parts' | 'ev-kits' | 'triride' | 'ev-batteries' | 'solar-batteries' | 'solar-parts';
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleDelete = async (postId: string) => {
  console.log('handleDelete called for postId:', postId);
  toast('Delete started for postId: ' + postId);


  try {
    // Step 1: Verify the post exists
    const getResponse = await fetch(`/api/posts/${postId}`);
    console.log('GET /api/posts/[id] response:', getResponse);
    if (!getResponse.ok) {
      const error = await getResponse.json();
      toast.error('GET failed: ' + (error.message || 'Post not found'));
      console.error('GET failed:', error);
      return;
    } else {
      toast.success('GET /api/posts/[id] success');
    }

    // Step 2: Send delete request
    const deleteResponse = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('DELETE /api/posts/[id] response:', deleteResponse);

    if (!deleteResponse.ok) {
      const error = await deleteResponse.json();
      toast.error('DELETE failed: ' + (error.message || 'Failed to delete post'));
      console.error('DELETE failed:', error);
      return;
    }

    const deleteResult = await deleteResponse.json();
    toast.success('Post deleted successfully: ' + (deleteResult.message || ''));
    console.log('DELETE success:', deleteResult);
    
    // Step 4: Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error('Error in delete operation:', error);
    toast.error('An unexpected error occurred: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export default function PostsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || `Error: ${response.status} ${response.statusText}`);
          return;
        }

        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data);
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch posts:', err);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchPosts();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Posts</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all posts in your website.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add post
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-8 text-center">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="mt-8 text-center">No posts found.</div>
          ) : (
            <>
              <button onClick={() => {console.log('Test Delete Clicked'); alert('Test Delete Clicked');}} className="mb-4 px-4 py-2 bg-blue-200 rounded">Test Delete</button>
              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {posts.map((post) => (
                            <tr key={post._id.toString()} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {post.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {post.category.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {post.price || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link 
                                  href={`/admin/posts/${post._id.toString()}`}
                                  className="text-primary hover:text-primary/90 mr-4"
                                >
                                  View
                                </Link>
                                <Link 
                                  href={`/admin/posts/${post._id.toString()}/edit`}
                                  className="text-primary hover:text-primary/90 mr-4"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => {
                                    setPendingDeleteId(post._id.toString());
                                    setConfirmOpen(true);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        open={confirmOpen}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
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

