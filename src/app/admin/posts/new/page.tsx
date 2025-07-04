'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [titleImageFile, setTitleImageFile] = useState<File | null>(null);
  const [titleImagePreview, setTitleImagePreview] = useState('');
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // --- handleTitleImageChange ---
  const handleTitleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTitleImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTitleImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- handleGalleryImagesChange ---
  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 20) {
      setError('You can upload a maximum of 20 gallery images.');
      return;
    }
    setGalleryImageFiles(files);
    // Generate previews
    Promise.all(files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    })).then(setGalleryImagePreviews);
  };

  // --- handleSubmit function added by Cascade ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    try {
      // Get values
      const title = formData.get('title') as string;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;
      const price = formData.get('price') as string;
      const featured = formData.get('featured') === 'on';
      const pinned = formData.get('pinned') === 'on';
      const highlight = formData.get('highlight') === 'on';

      if (!title || !category || !description || !price) {
        setError('Please fill in all required fields');
        return;
      }

      // Convert title image to base64 if present
      let titleImageBase64 = '';
      if (titleImageFile) {
        const reader = new FileReader();
        titleImageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(titleImageFile);
        });
      }

      // Convert gallery images to base64 array
      let galleryImagesBase64: string[] = [];
      if (galleryImageFiles.length > 0) {
        galleryImagesBase64 = await Promise.all(
          galleryImageFiles.map(file => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
          })
        );
      }

      const postData = {
        title,
        category,
        description,
        price,
        titleImage: titleImageBase64,
        galleryImages: galleryImagesBase64,
        featured,
        pinned,
        highlight,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create post');
      }
      router.push('/admin/posts');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(`Error: ${errorMessage}`);
    }
  };


  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  Loading...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* --- ???? ?? ?? ?? ??? ???? JSX ???? --- */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Create New Post</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
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
                    placeholder="e.g. $99.99"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="titleImage" className="block text-sm font-medium text-gray-700">Title Image</label>
                  <div className="mt-1 flex items-center">
                    <input
                      id="titleImage"
                      type="file"
                      accept="image/*"
                      onChange={handleTitleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                      title="Choose a title image"
                      aria-label="Choose a title image"
                    />
                  </div>
                  {titleImagePreview && (
                    <div className="mt-2">
                      <img src={titleImagePreview} alt="Title Preview" className="h-32 w-32 object-cover rounded-md" />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="galleryImages" className="block text-sm font-medium text-gray-700">Gallery Images (1-20)</label>
                  <div className="mt-1 flex items-center">
                    <input
                      id="galleryImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                      title="Choose gallery images"
                      aria-label="Choose gallery images"
                    />
                  </div>
                  {galleryImagePreviews.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {galleryImagePreviews.map((src, idx) => (
                        <img key={idx} src={src} alt={`Gallery Preview ${idx+1}`} className="h-20 w-20 object-cover rounded-md" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Feature checkboxes */}
                <div className="flex gap-6 mb-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="featured" className="form-checkbox h-5 w-5 text-primary" />
                    Show on Home
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="pinned" className="form-checkbox h-5 w-5 text-primary" />
                    Pin this post
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="highlight" className="form-checkbox h-5 w-5 text-primary" />
                    Highlight
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/posts')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* --- ???? ?? --- */}
    </div>
  );
}