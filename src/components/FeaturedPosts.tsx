'use client'
import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

export default function FeaturedPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        // Defensive: support both array and {posts: array}
        const postsArray = Array.isArray(data) ? data : data.data || [];
        setPosts(postsArray.filter((post: any) => post.featured));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading featured posts...</div>;
  if (!posts.length) return <div>No featured posts.</div>;

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
          >
            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 bg-transparent group-hover:bg-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20 cursor-pointer transition-all duration-300"
              onClick={() => window.location.href = `/posts/${post._id}`}
              onMouseEnter={e => {
                const icon = e.currentTarget.querySelector('.mag-icon');
                if (icon && icon.animate) {
                  icon.animate([
                    { opacity: 0, transform: 'translateY(-40px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                  ], {
                    duration: 350,
                    fill: 'forwards',
                    easing: 'ease-out'
                  });
                }
              }}
              onMouseLeave={e => {
                const icon = e.currentTarget.querySelector('.mag-icon');
                if (icon && icon.animate) {
                  icon.animate([
                    { opacity: 1, transform: 'translateY(0)' },
                    { opacity: 0, transform: 'translateY(-40px)' }
                  ], {
                    duration: 300,
                    fill: 'forwards',
                    easing: 'ease-in'
                  });
                }
              }}
            >
              <div
                className="mag-icon flex items-center justify-center rounded-full bg-white/90 shadow-lg w-16 h-16"
                style={{ opacity: 0, transform: 'translateY(-40px)' }}
              >
                {/* Magnifier Icon (Heroicons) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </div>
            </motion.div>
            {post.titleImage && (
              <img src={post.titleImage} alt={post.title} className="h-40 w-full object-cover rounded" />
            )}
            <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.category}</p>

          </motion.div>
        ))}
      </div>
    </section>
  );
}
