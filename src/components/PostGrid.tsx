'use client'
import React from 'react';
import HoverViewOverlay from './HoverViewOverlay'

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  price?: string;
  createdAt: string;
}

interface PostGridProps {
  posts: Post[];
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      key={post._id}
      className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-56 w-full">
        {post.image ? (
          <HoverViewOverlay
            onClick={() => window.location.href = `/posts/${post._id}`}
            isHovered={isHovered}
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover rounded"
            />
          </HoverViewOverlay>
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
        {post.price && (
          <p className="text-primary font-semibold">{post.price}</p>
        )}
      </div>
    </div>
  );
})}
    </div>
  );
}
