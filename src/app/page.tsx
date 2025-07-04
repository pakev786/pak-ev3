import React from 'react'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Products from '@/components/Products'
import Contact from '@/components/Contact'
import FeaturedPosts from '@/components/FeaturedPosts'

import FooterBar from '@/components/FooterBar'
import fs from 'fs';
import path from 'path';

async function getContactInfo() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/contact.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
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