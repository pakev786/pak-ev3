'use client'

import React from 'react'
import Image from 'next/image'

export type Post = {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
}

type PostsProps = {
  posts: Post[]
  category: string
}

const Posts: React.FC<PostsProps> = ({ posts, category }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Latest {category} Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {post.date} • By {post.author}
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button
                  onClick={() => window.location.href = `/posts/${post.id}`}
                  className="text-primary font-medium hover:text-primary/90 transition-colors"
                >
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Posts
