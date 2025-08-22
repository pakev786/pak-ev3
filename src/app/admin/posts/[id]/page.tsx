'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

interface Post {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  titleImage: string;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
  isMainPromo?: boolean;
  promoSlot?: 1 | 2 | 3 | 4 | null;
}

export default function ViewPostPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        const data = await response.json();
        if (response.ok) {
          setPost(data);
        } else {
          const errorMessage = data.error || 'Failed to fetch post';
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        const errorMessage = 'Failed to fetch post';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchPost();
    }
  }, [params.id, status]);

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-red-600">{error}</div>
              <div className="mt-4">
                <Link href="/admin/posts" className="text-primary hover:text-primary/90">
                  Back to posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
              <div className="flex space-x-4">
                <Link
                  href={`/admin/posts/${post._id}/edit`}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Edit Post
                </Link>
                <Link
                  href="/admin/posts"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Back to List
                </Link>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              {post.titleImage && (
                <div className="mb-6">
                  <div className="relative h-64 w-full overflow-hidden rounded-lg">
                    <Image
                      src={post.titleImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized={post.titleImage.startsWith('data:')}
                    />
                  </div>
                </div>
              )}

              {Array.isArray(post.galleryImages) && post.galleryImages.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[post.titleImage, ...post.galleryImages.filter(img => img !== post.titleImage)].map((img, idx) => (
                      <div key={idx} className="relative w-full aspect-square overflow-hidden rounded-lg border">
                        <Image
                          src={img}
                          alt={`Gallery Image ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized={img.startsWith('data:')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* --- پرومو اسٹیٹس --- */}
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">پروموشن اسٹیٹس</dt>
                  <dd className="mt-1 text-lg">
                    {post.isMainPromo ? (
                      <span className="text-green-700 font-bold">مین پرومو پوسٹ (سب سے بڑی)</span>
                    ) : post.promoSlot ? (
                      <span className="text-blue-700 font-bold">پروموٹڈ پوسٹ (سلاٹ {post.promoSlot})</span>
                    ) : (
                      <span className="text-gray-500">نارمل پوسٹ</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-lg text-gray-900">
                    {post.category.replace(/-/g, ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-lg text-gray-900">{post.price}</dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{post.description}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-gray-900">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-gray-900">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
