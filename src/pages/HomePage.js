import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 1. Updated stats array with the link property
const stats = [
  { label: 'EV Kits Delivered', value: '1.2K+' },
  { label: 'Cities Covered', value: '20+', link: '/branches' }, 
  { label: 'Customer Satisfaction', value: '4.9/5' },
];

const marqueeStyles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: flex;
    animation: marquee 25s linear infinite;
  }
  .marquee-container:hover .animate-marquee {
    animation-play-state: paused;
  }
`;

function HomePage() {
  const [banners, setBanners] = useState({});
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, sectionsRes, productsRes, catsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/banners`),
          axios.get(`${BASE_URL}/api/sections`),
          axios.get(`${BASE_URL}/api/products`),
          axios.get(`${BASE_URL}/api/categories`)
        ]);
        setBanners(bannersRes.data);
        setSections(sectionsRes.data);
        setProducts(productsRes.data);
        setCategories(catsRes.data);
      } catch (error) {
        console.error('Failed to fetch homepage data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBannerUrl = (slot) => {
    if (banners[slot] && banners[slot].image) {
      return `${BASE_URL}${banners[slot].image}`;
    }
    return null;
  };

  const getBannerLink = (slot) => {
    const banner = banners[slot];
    if (!banner || banner.linkType === 'none' || !banner.linkValue) return '#';

    if (banner.linkType === 'static') {
        return banner.linkValue;
    }
    
    if (banner.linkType === 'category') {
        const cat = categories.find(c => c.id === banner.linkValue);
        return cat ? `/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}` : '#';
    }

    if (banner.linkType === 'section') {
        const sec = sections.find(s => s.id === banner.linkValue);
        return sec ? `/section/${sec.name.toLowerCase().replace(/\s+/g, '-')}` : '#';
    }

    return '#';
  };

  const BannerBox = ({ slot, fallbackColor, className }) => {
    const imgUrl = getBannerUrl(slot);
    const linkTo = getBannerLink(slot);
    const isLink = linkTo !== '#';

    return (
      <Link 
        to={linkTo}
        className={`relative overflow-hidden rounded-2xl group block ${className} ${!imgUrl ? fallbackColor : ''} ${!isLink ? 'cursor-default' : ''}`}
        onClick={e => !isLink && e.preventDefault()}
      >
        {imgUrl ? (
          <img src={imgUrl} alt="Promo" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-white font-bold text-xl uppercase tracking-widest">Coming Soon</span>
          </div>
        )}
        {isLink && (
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </Link>
    );
  };

  // --- Product Card Component ---
  const ProductCard = ({ product }) => (
    <Link to={`/product/${product.id}`} className="flex-none w-64 md:w-72 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden cursor-pointer">
      <div className="h-48 relative bg-gray-50 rounded-t-xl overflow-hidden p-4 flex items-center justify-center">
        <img 
          src={`${BASE_URL}${product.image}`} 
          alt={product.title} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {product.optionalPrice > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">Sale</span>
            )}
            {product.codAvailable ? (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-green-200">COD</span>
            ) : (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-blue-200">No COD</span>
            )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-400 font-bold uppercase mb-1">{product.category?.name || 'Parts'}</div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base group-hover:text-orange-600 transition-colors" title={product.title}>{product.title}</h3>
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="block text-lg font-bold text-gray-900">₨ {product.price.toLocaleString()}</span>
            {product.optionalPrice > 0 && (
               <span className="block text-xs text-gray-400 line-through">₨ {product.optionalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-orange-600 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );

  const ProductSection = ({ section }) => {
    const scrollRef = useRef(null);
    const sectionProducts = products.filter(p => p.section && p.section.id === section.id);

    if (sectionProducts.length === 0) return null;

    const scroll = (direction) => {
      if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = 300; 
        current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      }
    };

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-2xl font-bold text-gray-900">{section.name}</h2>
          <Link 
            to={`/section/${section.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex items-center text-orange-600 font-semibold hover:text-orange-700 transition"
          >
            <span className="mr-1">See All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {section.isMarquee ? (
          <div className="relative overflow-hidden marquee-container">
            <div className="flex gap-6 animate-marquee w-max">
              {[...sectionProducts, ...sectionProducts].map((product, idx) => (
                <ProductCard key={`${product.id}-${idx}`} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative group">
            <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-orange-50 focus:outline-none hidden md:flex">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {sectionProducts.map((product) => (
                <div key={product.id} className="snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-orange-50 focus:outline-none hidden md:flex">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <style>{marqueeStyles}</style>
      <Navbar />
      
      <section className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {loading ? (
          <div className="h-[500px] bg-gray-200 rounded-3xl animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[550px]">
            <BannerBox slot="main" fallbackColor="bg-gray-800" className="h-64 md:h-full shadow-lg" />
            <div className="grid grid-cols-2 gap-4 h-auto md:h-full">
               <BannerBox slot="side1" fallbackColor="bg-orange-900" className="h-32 md:h-auto shadow-md" />
               <BannerBox slot="side2" fallbackColor="bg-blue-900" className="h-32 md:h-auto shadow-md" />
               <BannerBox slot="side3" fallbackColor="bg-green-900" className="h-32 md:h-auto shadow-md" />
               <BannerBox slot="side4" fallbackColor="bg-purple-900" className="h-32 md:h-auto shadow-md" />
            </div>
          </div>
        )}
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* 2. Stats Section - Updated to handle links conditionally */}
        <section className="grid grid-cols-3 gap-2 md:gap-4 mb-16">
          {stats.map((stat) => {
            // Define content to avoid repetition
            const content = (
                <>
                <p className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 md:mt-2 text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-semibold leading-tight">
                    {stat.label}
                </p>
                </>
            );

            // Conditional Rendering: Link vs Div
            if (stat.link) {
                return (
                    <Link
                    key={stat.label}
                    to={stat.link}
                    className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-orange-200 transition-all cursor-pointer"
                    >
                    {content}
                    </Link>
                );
            }

            return (
                <div
                    key={stat.label}
                    className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6 flex flex-col items-center justify-center text-center"
                >
                    {content}
                </div>
            );
          })}
        </section>

        {loading ? (
           <div className="space-y-8">{[1, 2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : sections.length > 0 ? (
           sections.map(section => <ProductSection key={section.id} section={section} />)
        ) : (
          <div className="text-center py-20 text-gray-400"><p>No sections configured.</p></div>
        )}

        <section className="mt-20 bg-black text-white rounded-3xl p-10 flex flex-col lg:flex-row lg:items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
          <div className="flex-1 relative z-10">
            <p className="text-orange-400 uppercase tracking-[0.4em] text-xs font-bold">Launch Offer</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">Free on-site audit for every new charging station order</h2>
            <p className="mt-4 text-gray-300 max-w-xl">Book Pak EV engineers to survey your site, design optimal solar integration, and size the right charging hardware—all included.</p>
          </div>
          <button className="relative z-10 px-8 py-4 bg-white text-black font-bold rounded-2xl shadow-lg hover:scale-105 transition transform">Book a visit</button>
        </section>
      </main>
    </div>
  );
}

export default HomePage;