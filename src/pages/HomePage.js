import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 1. Updated stats array with the link property
const stats = [
  { label: 'EV Kits Delivered', value: '12K+' },
  { label: 'Cities Covered', value: '20+', link: '/branches' }, 
  { label: 'Customer Satisfaction', value: '99.8/100' },
];

const contactInfo = [
  { 
    name: 'Call', 
    value: '+923070035533',
    icon: 'M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A15 15 0 013 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.27 1.11z',
    hover: 'hover:text-green-600' 
  },
  { 
    name: 'Address', 
    value: 'Back of ZTBL head rajkan, yazman, bahawalpur',
    icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-3.13-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z',
    hover: 'hover:text-blue-600' 
  }
];

const socialLinks = [
  { name: 'WhatsApp Channel', url: 'https://wa.me/+923070035533', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z', color: 'text-green-500 hover:text-green-600' },
  { name: 'Instagram', url: 'https://www.instagram.com/pakev_official', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', color: 'text-pink-600 hover:text-pink-700' },
  { name: 'YouTube', url: 'http://www.youtube.com/@PAKEVOfficial', icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z', color: 'text-red-600 hover:text-red-700' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@pak.ev8', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.35-1.17 1.09-1.07 1.93.03.58.01 1.16.44 1.54.48.42 1.3.31 1.8.02.57-.33 1.01-.9 1.09-1.51.13-1.04.09-2.09.09-3.13.01-4.31-.02-8.62.01-12.93.04.03.09.06.13.09h-.16z', color: 'text-black hover:text-gray-800' },
  { name: 'Facebook', url: 'https://www.facebook.com/share/1H1t8S5GW6/', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: 'text-blue-600 hover:text-blue-700' }
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




        <footer className="mt-20 border-t border-gray-100 bg-white pt-20 pb-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

              {/* Column 1: Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                    <span className="text-2xl font-black">P</span>
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">PAK EV</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  We are a proud Pakistani brand with over 7 years of experience in the power sector, dedicated to converting fuel vehicles to electric and providing high-quality EV components nationwide at the most competitive rates. Under the leadership of our CEO, Haroon Umar, whose innovative ideas drive our vision, we are committed to shaping a sustainable electric future.
                </p>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  Address: Back of ZTBL head rajkan, yazman, bahawalpur</p>
              </div>

              {/* Column 2: Navigation */}
              <div>
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-8">Quick Links</h4>
                <ul className="space-y-4">
                  {[
                    { label: 'About Us', path: '/about-us' },
                    { label: 'Branches', path: '/branches' },
                    { label: 'EV Calculator', path: '/ev-calculator' },
                    { label: 'Load Calculator', path: '/load-calculator' }
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="text-gray-600 hover:text-orange-600 font-medium transition-colors text-sm flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-orange-600 transition-all"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Social Connectivity */}
              {/* Column 3: Contact Us */}
              <div>
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-8">Connect With Us</h4>

                {/* New Contact Rows */}
                <div className="space-y-4 mb-8">
                  {contactInfo.map((item) => (
                    <div key={item.name} className="flex items-center gap-4 group cursor-pointer">
                      <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 transition-all group-hover:bg-orange-600 group-hover:text-white`}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter leading-none mb-1">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-700 font-semibold group-hover:text-orange-600 transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Icons Grid */}
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-white hover:scale-110 hover:shadow-lg ${social.hover}`}
                      title={social.name}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>

                {/* Existing Support Hours Section */}
                <div className="mt-10 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Support Hours</p>
                  <p className="text-xs text-gray-600 font-medium">Sat - Thur: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-400 font-medium italic">
                Made with Pride in Pakistan 🇵🇰
              </p>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} PAK EV. All rights reserved.
              </p>
            </div>
          </div>
        </footer>


      </main>
    </div>
  );
}

export default HomePage;