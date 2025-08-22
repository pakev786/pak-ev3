'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

interface Post {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  galleryImages?: string[]; // <-- add gallery images
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  pinned?: boolean;
  highlight?: boolean;
}

// NOTE: The checkboxes for featured, pinned, and highlight are shown near the bottom of the form, pre-filled with the post's current values.
export default function EditPostPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

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
          setImagePreview(data.imageUrl);
          setGalleryPreviews(data.galleryImages || []);
        } else {
          setError(data.error || 'Failed to fetch post');
        }
      } catch (err) {
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchPost();
    }
  }, [params.id, status]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery images change
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove gallery image preview
  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
    setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;
      const price = formData.get('price') as string;
      const featured = formData.get('featured') === 'on';
      const isMainPromo = formData.get('isMainPromo') === 'on';
      let promoSlot: number | null = null;
      const promoSlotRaw = formData.get('promoSlot');
      if (promoSlotRaw !== undefined && promoSlotRaw !== null && promoSlotRaw !== '') {
        const slotNum = Number(promoSlotRaw);
        if ([1,2,3,4].includes(slotNum)) promoSlot = slotNum;
      }

      if (!title || !category || !description || !price) {
        setError('Please fill in all required fields');
        return;
      }

      let imageUrl = post?.imageUrl || '';
      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      // Prepare gallery images (frontend only)
      let galleryImages = galleryPreviews;

      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          description,
          price,
          imageUrl,
          galleryImages, // <-- include gallery images
          featured,
          isMainPromo,
          promoSlot
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update post');
      }

      toast.success('Post updated successfully');
      router.push('/admin/posts');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

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
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  defaultValue={post.title}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue={post.category}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="ev-parts">EV Parts</option>
                  <option value="ev-kits">EV Kits</option>
                  <option value="triride">TriRide</option>
                  <option value="ev-batteries">EV Batteries</option>
                  <option value="solar-batteries">Solar Batteries</option>
                  <option value="solar-parts">Solar Parts</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  required
                  defaultValue={post.price}
                  placeholder="e.g. $99.99"
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  defaultValue={post.description}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Current Image</label>
                {imagePreview ? (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-md object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">No image uploaded</div>
                )}
                <label htmlFor="image" className="mt-4 block text-sm font-medium text-gray-700">
                  Change Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>

              {/* Gallery Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                {galleryPreviews && galleryPreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {galleryPreviews.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <Image
                          src={img}
                          alt={`Gallery Image ${idx + 1}`}
                          width={120}
                          height={120}
                          className="rounded object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs opacity-80 hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">No gallery images uploaded</div>
                )}
                <label htmlFor="gallery" className="mt-4 block text-sm font-medium text-gray-700">
                  Add Gallery Images
                </label>
                <input
                  type="file"
                  id="gallery"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href="/admin/posts"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Cancel
                </Link>
                <div className="flex gap-6 mb-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="featured" className="form-checkbox h-5 w-5 text-primary" defaultChecked={post?.featured} />
                    Show on Home
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="isMainPromo" className="form-checkbox h-5 w-5 text-green-600" defaultChecked={post?.isMainPromo} />
                    <span className="text-green-700 font-bold">مین پرومو پوسٹ</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-blue-700 font-bold">پرومو سلاٹ (1-4):</span>
                    <input
                      type="number"
                      name="promoSlot"
                      min={1}
                      max={4}
                      className="form-input w-16 text-center border rounded"
                      defaultValue={post?.promoSlot || ''}
                      placeholder="-"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Update Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
