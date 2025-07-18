import React from 'react'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Products from '@/components/Products'
import Contact from '@/components/Contact'
import FeaturedPosts from '@/components/FeaturedPosts'

import FooterBar from '@/components/FooterBar'

//
// اب fs اور path استعمال نہیں ہو سکتے، اس لیے contact info ایک API route سے لی جاتی ہے۔
// یہ طریقہ Next.js app directory اور future deployment کے لیے بہترین ہے۔
//
async function getContactInfo() {
  try {
    const res = await fetch('/api/contact-info', { cache: 'no-store' });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return { email: 'info@pakev.com', phone: '+92 300 1234567' };
  }
}

export default async function HomePage() {
  const contact = await getContactInfo();
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="relative z-10">
          <Hero />
          <Features />
          <FeaturedPosts />
          <Products />
        </div>
      </main>
      <FooterBar email={contact.email} phone={contact.phone} facebook={contact.facebook} youtube={contact.youtube} instagram={contact.instagram} />
    </>
  )
}