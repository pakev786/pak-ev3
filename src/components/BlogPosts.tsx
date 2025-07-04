'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Post = {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  slug: string
}

type BlogPostsProps = {
  category?: string
  title?: string
}

const BlogPosts: React.FC<BlogPostsProps> = ({ 
  category = 'All',
  title = 'Latest Updates'
}) => {
  // This would typically come from your API or database
  const posts: Post[] = [
    {
      id: '1',
      title: 'New EV Charging Solutions',
      excerpt: 'Discover our latest range of EV charging solutions designed for both home and commercial use.',
      image: '/blog/charging.jpg',
      date: '2025-05-16',
      category: 'EV Parts',
      slug: 'new-ev-charging-solutions'
    },
    {
      id: '2',
      title: 'Solar Battery Technology',
      excerpt: 'How solar batteries are changing the energy landscape for EVs and homes.',
      image: '/blog/solar-battery.jpg',
      date: '2025-05-15',
      category: 'Solar Batteries',
      slug: 'solar-battery-technology'
    }
  ]

  const filteredPosts = category === 'All' 
    ? posts 
    : posts.filter(post => post.category === category)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

type BlogPostCardProps = {
  post: Post
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <article
      className="group bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-blue-50 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
        />
        {/* Hover Overlay & Magnifier */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="opacity-100 transition-all duration-300 flex items-center justify-center rounded-full bg-white/90 shadow-lg w-16 h-16 pointer-events-auto"
            style={{ transitionProperty: 'opacity, transform' }}
            onClick={() => window.location.href = `/blog/${post.slug}`}
          >
            {/* Magnifier Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </motion.div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-primary font-medium">{post.category}</span>
          <time className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</time>
        </div>
        <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
          <Link href={post.slug === 'triride' ? '/triride' : `/blog/${post.slug}` } prefetch={false} onClick={e => { if(post.slug === 'triride'){ e.preventDefault(); window.location.href = '/triride'; } }} >{post.title}</Link>
        </h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <Link 
          href={post.slug === 'triride-success-stories' || post.slug === 'triride' ? '/triride' : `/blog/${post.slug}`}
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          Read More
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default BlogPosts
