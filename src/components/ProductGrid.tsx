'use client'

import React from 'react';
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoaderEV from './LoaderEV';
interface Post {
  _id: { toString(): string };
  title: string;
  description: string;
  price: string;
  category: 'ev-parts' | 'ev-kits' | 'triride' | 'ev-batteries' | 'solar-batteries' | 'solar-parts';
  imageUrl?: string;
  titleImage?: string;
  createdAt: string;
  updatedAt: string;
}
import styles from './ProductGrid.module.css'
import HoverViewOverlay from './HoverViewOverlay'

interface ProductGridProps {
  category: 'ev-parts' | 'ev-kits' | 'triride' | 'ev-batteries' | 'solar-batteries' | 'solar-parts'
}

export default function ProductGrid({ category }: ProductGridProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching posts for category:', category);
        
        const response = await fetch(`/api/posts?category=${category}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data);
        } else {
          console.warn('Invalid data format:', data);
          setPosts([]);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoaderEV size={64} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No products available in this category yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {posts.map((post) => (
        <ProductCard key={post._id.toString()} post={post} />
      ))}
    </div>
  );
}

function ProductCard({ post }: { post: Post }) {
  const [isHovered, setIsHovered] = React.useState(false);
  // Prefer titleImage, fallback to imageUrl, fallback to empty string
  const imageSrc = post.titleImage || post.imageUrl || '';

  return (
    <Link
      href={`/posts/${post._id?.toString?.() ?? post._id}`}
      className={`relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 group cursor-pointer`}
      style={{ height: '100%', display: 'block' }}
      tabIndex={0}
    >
      <div className="relative h-96 w-full flex items-center justify-center">
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={post.title || 'No Title'}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
            {/* Overlay title and price at bottom */}
            <div className="absolute bottom-0 left-0 w-full bg-black/60 px-4 py-3 flex flex-col items-start z-10">
              <span className="font-semibold text-base truncate w-full text-white" title={post.title}>{post.title || 'No Title'}</span>
              <span className="font-bold text-lg" style={{ color: '#FFD700' }}>{post.price || 'No Price'}</span>
            </div>
          </>
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}

