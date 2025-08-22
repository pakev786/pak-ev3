
import React from "react";
import Link from "next/link";

// اردو: یہ کمپوننٹ ایک بڑی اور چار چھوٹی تصویریں شو کرتا ہے، ہر تصویر کے پیچھے لنک اور ٹیکسٹ اپنی مرضی سے سیٹ ہو سکتا ہے

interface Banner {
  image: string;
  link: string;
  title?: string;
  description?: string;
  large?: boolean; // صرف ایک پر true ہوگا
}

interface PromoBannerGridProps {
  banners: Banner[];
}

const PromoBannerGrid: React.FC<PromoBannerGridProps> = ({ banners }) => {
  // بڑی تصویر: large=true یا پہلی تصویر
  const largeBanner = banners.find(b => b.large) || banners[0];
  // باقی چار چھوٹی تصویریں
  const smallBanners = banners.filter(b => b !== largeBanner).slice(0, 4);

  // اگر کوئی بینر نہیں تو کچھ نہ دکھائیں
  if (!largeBanner || !largeBanner.link || !largeBanner.image) return null;

  return (
    <div className="w-full px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 mt-0">
      {/* بڑی تصویر */}
      <Link href={largeBanner.link} className="md:col-span-2 relative group rounded-xl overflow-hidden min-h-[224px] flex items-end shadow-lg">
        <img src={largeBanner.image} alt={largeBanner.title || "Banner"} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-0 bottom-0 p-6">
          <div className="text-white text-2xl md:text-3xl font-bold mb-2 drop-shadow">{largeBanner.title}</div>
          {largeBanner.description && <div className="text-white text-base bg-[#FF9100] inline-block px-4 py-1 rounded-full font-semibold mt-1 drop-shadow">{largeBanner.description}</div>}
        </div>
      </Link>

      {/* چار چھوٹی تصویریں */}
      <div className="grid grid-cols-2 gap-4 h-full">
        {smallBanners.map((banner, idx) => (
          banner && banner.link && banner.image ? (
            <Link key={idx} href={banner.link} className="relative group rounded-xl overflow-hidden min-h-[96px] flex items-end shadow-md">
              <img src={banner.image} alt={banner.title || `Banner ${idx+2}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-0 bottom-0 p-4">
                <div className="text-white text-lg font-bold drop-shadow">{banner.title}</div>
                {banner.description && <div className="text-white text-xs bg-[#FF9100] inline-block px-3 py-0.5 rounded-full font-semibold mt-1 drop-shadow">{banner.description}</div>}
              </div>
            </Link>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default PromoBannerGrid;
