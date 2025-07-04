"use client";

import { useEffect, useState } from "react";
import LoaderEV from "@/components/LoaderEV";
import StickyHeadingBar from "@/components/StickyHeadingBar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

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
}

export default function PublicPostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // Image carousel state for top image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // All images for lightbox and carousel
  const allImages = post ? [post.titleImage, ...(post.galleryImages?.filter(img => img !== post.titleImage) || [])] : [];

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setLightboxIndex(idx => (idx - 1 + allImages.length) % allImages.length);
      if (e.key === 'ArrowRight') setLightboxIndex(idx => (idx + 1) % allImages.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, allImages.length]);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        const data = await response.json();
        if (response.ok) {
          setPost(data);
        } else {
          setError(data.error || "Failed to fetch post");
        }
      } catch (err) {
        setError("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  const [otherPosts, setOtherPosts] = useState<Post[]>([]);

  // Fetch other posts for the same category (page)
  useEffect(() => {
    if (!post) return;
    const fetchOtherPosts = async () => {
      try {
        const response = await fetch(`/api/posts?category=${encodeURIComponent(post.category)}`);
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data)) {
          setOtherPosts(data.data.filter((p: Post) => p._id !== post._id));
        }
      } catch {}
    };
    fetchOtherPosts();
  }, [post]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><LoaderEV size={64} /></div>;
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-red-600">{error}</div>
              <div className="mt-4">
                <button onClick={() => router.back()} className="text-primary hover:text-primary/90">Back</button>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <StickyHeadingBar title={
              post?.category === 'ev-batteries' ? 'EV Batteries' :
              post?.category === 'solar-batteries' ? 'Solar Batteries' :
              post?.category === 'ev-parts' ? 'EV Parts' :
              post?.category === 'solar-parts' ? 'Solar Parts' :
              post?.category === 'ev-kits' ? 'EV Kits' :
              post?.category === 'triride' ? 'TriRide' :
              post?.category === 'branches' ? 'Branches' :
              'Blog'
            } />
            {allImages.length > 0 && (
              <div className="mb-6">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={post.title}
                    fill
                    className="object-contain"
                    unoptimized={allImages[currentImageIndex]?.startsWith("data:")}
                  />
                  {/* Left Arrow */}
                  {allImages.length > 1 && (
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 focus:outline-none"
                      onClick={() => setCurrentImageIndex(idx => (idx - 1 + allImages.length) % allImages.length)}
                      aria-label="Previous"
                    >
                      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                  )}
                  {/* Right Arrow */}
                  {allImages.length > 1 && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 focus:outline-none"
                      onClick={() => setCurrentImageIndex(idx => (idx + 1) % allImages.length)}
                      aria-label="Next"
                    >
                      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            {Array.isArray(post.galleryImages) && post.galleryImages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[post.titleImage, ...post.galleryImages.filter(img => img !== post.titleImage)].map((img, idx) => (
                    <button
                      key={idx}
                      className="relative w-full aspect-square overflow-hidden rounded-lg border focus:outline-none"
                      onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                      aria-label={`Open image ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Gallery Image ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={img.startsWith("data:")}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lightbox Modal */}
            {lightboxOpen && allImages.length > 0 && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                onClick={() => setLightboxOpen(false)}
                style={{ cursor: 'zoom-out' }}
              >
                <div
                  className="relative max-w-3xl w-full flex flex-col items-center"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 focus:outline-none"
                    onClick={() => setLightboxOpen(false)}
                    aria-label="Close"
                  >
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 focus:outline-none"
                    onClick={() => setLightboxIndex(idx => (idx - 1 + allImages.length) % allImages.length)}
                    aria-label="Previous"
                  >
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <div className="w-full flex justify-center items-center">
                    <Image
                      src={allImages[lightboxIndex]}
                      alt={`Gallery Image ${lightboxIndex + 1}`}
                      width={700}
                      height={500}
                      className="object-contain rounded-lg max-h-[80vh] bg-white"
                      unoptimized={allImages[lightboxIndex].startsWith('data:')}
                    />
                  </div>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 focus:outline-none"
                    onClick={() => setLightboxIndex(idx => (idx + 1) % allImages.length)}
                    aria-label="Next"
                  >
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  <div className="mt-2 text-white text-sm">Image {lightboxIndex + 1} of {allImages.length}</div>
                </div>
              </div>
            )}
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {post.category.replace(/-/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-lg text-gray-900">{post.price}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{post.description}</dd>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded shadow transition"
                    onClick={() => alert('Buy Now functionality coming soon!')}
                  >
                    Buy Now
                  </button>
                  <AddToCartButton post={post} />
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-gray-900">{new Date(post.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-gray-900">{new Date(post.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {/* Other posts grid */}
      {otherPosts.length > 0 && (
        <div className="w-full mt-10 px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 sm:px-6 lg:px-8">
            {otherPosts.map((p) => (
              <button
                key={p._id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition group text-left cursor-pointer"
                onClick={async () => {
                  setLoading(true);
                  setCurrentImageIndex(0);
                  try {
                    const response = await fetch(`/api/posts/${p._id}`);
                    const data = await response.json();
                    if (response.ok) {
                      setPost(data);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={p.titleImage || p.galleryImages?.[0] || '/placeholder.jpg'}
                    alt={p.title}
                    fill
                    className="object-cover rounded-t-lg"
                    unoptimized={p.titleImage?.startsWith('data:')}
                  />
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <span className="font-semibold text-base truncate text-gray-900" title={p.title}>{p.title}</span>
                  <span className="font-bold text-sm" style={{ color: '#FFD700' }}>{p.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
