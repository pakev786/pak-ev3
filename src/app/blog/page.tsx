'use client'

import { useEffect, useState } from 'react'
import LoaderEV from '@/components/LoaderEV'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  image: string
  category: string
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        if (Array.isArray(data)) {
          setPosts(data)
        } else {
          setPosts([])
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err)
        setError('Failed to load blog posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderEV size={64} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest News</h1>
          <p className="text-xl text-gray-600 mb-12">
            Stay updated with the latest news and developments in EV charging
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={post.image || '/placeholder.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.content}
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Read more →
                  </Link>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !error && (
          <div className="text-center text-gray-600 py-12">
            No blog posts available yet.
          </div>
        )}
      </div>
    </div>
  )
}
