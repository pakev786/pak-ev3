import React from 'react'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Products from '@/components/Products'
import Contact from '@/components/Contact'
import FeaturedPosts from '@/components/FeaturedPosts'
import PromoBannerGrid from '@/components/PromoBannerGrid' // پرومو بینر گرڈ امپورٹ
import DebugPostsClient from '@/components/DebugPostsClient'

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

  // --- پوسٹس لوڈ کریں ---
  let posts: any[] = [];
  try {
    const baseUrl = typeof window === 'undefined' ? 'http://localhost:3000' : '';
    const res = await fetch(`${baseUrl}/api/posts`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    if (typeof window !== 'undefined') {
      console.log('API posts response:', data);
    }
    if (data.success && Array.isArray(data.data)) {
      posts = data.data;
    }
  } catch (e) {
    if (typeof window !== 'undefined') {
      console.log('API error:', e);
    }
  }

  // --- سادہ اور Robust مین/سلاٹ پوسٹس سلیکشن ---
  // Robust promo logic: handle boolean, string, number, 'on', and both _id/id
  const mainPost = posts.find(p =>
    p.isMainPromo === true ||
    p.isMainPromo === 'true' ||
    p.isMainPromo === 1 ||
    p.isMainPromo === '1' ||
    p.isMainPromo === 'on'
  ) || null;

  const slotPosts = [1, 2, 3, 4].map(slot =>
    posts.find(p =>
      (Number(p.promoSlot) === slot || p.promoSlot === slot || p.promoSlot === slot.toString()) &&
      (!mainPost || (p._id || p.id) !== (mainPost._id || mainPost.id))
    ) || null
  );
  // fallback logic: اگر کوئی مین یا سلاٹ پوسٹ نہ ملے تو فالتو پوسٹس سے پورا کریں
  const usedIds = new Set([mainPost?._id, ...slotPosts.filter(Boolean).map(p => p._id)]);
  const fallbackPosts = posts.filter(p => !usedIds.has(p._id));
  const finalMain = mainPost || fallbackPosts[0] || null;
  const finalSlots = slotPosts.map((s, i) => s || fallbackPosts[i + (finalMain ? 1 : 0)] || null);

  // --- PromoBannerGrid کے لیے بینرز بنائیں ---
  const banners = [
    finalMain && {
      image: finalMain.titleImage || finalMain.imageUrl || "/no-image.png",
      link: `/posts/${finalMain._id || finalMain.id}`,
      title: finalMain.title,
      description: finalMain.price,
      large: true
    },
    ...finalSlots.map((p, idx) => p && ({
      image: p.titleImage || p.imageUrl || "/no-image.png",
      link: `/posts/${p._id || p.id}`,
      title: p.title,
      description: p.price
    }))
  ].filter(Boolean);




  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="relative z-10">
          <Hero />

          <div className="-mt-6">
            <PromoBannerGrid banners={banners} />
          </div>
          <Features />
          <FeaturedPosts />
          <Products />
        </div>
      </main>
      <FooterBar email={contact.email} phone={contact.phone} facebook={contact.facebook} youtube={contact.youtube} instagram={contact.instagram} />
    </>
  )
}