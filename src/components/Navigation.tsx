"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// کیٹیگریز اور سب کیٹیگریز (demo data)
const categories = [
  {
    name: 'EV Parts',
    href: '/ev-parts',
    subcategories: [
      { name: 'Motors', href: '/ev-parts/motors' },
      { name: 'Controllers', href: '/ev-parts/controllers' },
      { name: 'Chargers', href: '/ev-parts/chargers' },
      { name: 'Displays', href: '/ev-parts/displays' },
    ],
  },
  {
    name: 'Batteries',
    href: '/ev-batteries',
    subcategories: [
      { name: 'Lithium', href: '/ev-batteries/lithium' },
      { name: 'Lead Acid', href: '/ev-batteries/lead-acid' },
      { name: 'Solar Batteries', href: '/solar-batteries' },
    ],
  },
  {
    name: 'Solar',
    href: '/solar-parts',
    subcategories: [
      { name: 'Solar Panels', href: '/solar-parts/panels' },
      { name: 'Inverters', href: '/solar-parts/inverters' },
      { name: 'Chargers', href: '/solar-parts/chargers' },
    ],
  },
  {
    name: 'Kits',
    href: '/ev-kits',
    subcategories: [
      { name: 'Rickshaw Kits', href: '/ev-kits/rickshaw' },
      { name: 'Bike Kits', href: '/ev-kits/bike' },
      { name: 'Loader Kits', href: '/ev-kits/loader' },
    ],
  },
  {
    name: 'Accessories',
    href: '/accessories',
    subcategories: [
      { name: 'Lights', href: '/accessories/lights' },
      { name: 'Mirrors', href: '/accessories/mirrors' },
      { name: 'Covers', href: '/accessories/covers' },
    ],
  },
  {
    name: 'Tools',
    href: '/tools',
    subcategories: [
      { name: 'EV Tools', href: '/tools/ev' },
      { name: 'Solar Tools', href: '/tools/solar' },
    ],
  },
];

// alladin.pk style modern e-commerce header - Urdu comments included
// صرف All Categories کے لیے mega menu dropdown
function MegaMenuAllCategories() {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className="relative h-full group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/categories"
        className={
          `relative px-4 py-2 flex items-center h-full font-semibold text-gray-700
          hover:text-primary transition-colors duration-150 focus:outline-none`
        }
        tabIndex={0}
        style={{transition: 'color 0.18s cubic-bezier(.4,0,.2,1)'}}
      >
        All Categories
        {/* underline: alladin.pk style */}
        <span
          className={`absolute left-2 right-2 -bottom-1 h-[3px] rounded-full bg-primary transition-all duration-200
            opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100
          `}
          style={{transformOrigin:'center'}}
        />
        <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </Link>
      {/* میگا مینیو ڈراپ ڈاؤن - صرف All Categories */}
      <div
        className={
          `pointer-events-none absolute left-0 top-full min-w-[340px] mt-2 z-50
          transition-all duration-200 origin-top opacity-0 scale-95
          ${open ? 'pointer-events-auto opacity-100 scale-100' : ''}`
        }
        style={{filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.12))'}}
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-2 gap-x-8 gap-y-2 animate-fadeIn">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="font-bold text-gray-800 mb-2">{cat.name}</div>
              {cat.subcategories && cat.subcategories.map((sub: any) => (
                <Link
                  key={sub.name}
                  href={sub.href}
                  className="block px-3 py-2 rounded-lg hover:bg-primary/10 text-gray-700 hover:text-primary font-medium transition-colors duration-150"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import TopAnnouncementSlider from './TopAnnouncementSlider';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  }
  // موبائل drawer میں کس category کا accordion کھلا ہے؟ (index)
  const [openIdx, setOpenIdx] = useState<number|null>(null);

  // موبائل مینیو یا سرچ اوورلے اوپن ہونے پر body scroll disable
  useEffect(() => {
    if (isMenuOpen || showSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // صفائی (cleanup)
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen, showSearch]);

  return (
    <>
      {/* اوپر ایناؤنسمنٹ سلائیڈر (alladin.pk اسٹائل) */}
      <TopAnnouncementSlider />
      {/* اوپر والا ٹاپ بار (فون، ای میل وغیرہ) ڈیلیٹ کر دیا گیا */}

      {/* مین ہیڈر بار: لوگو، سرچ، آئیکنز */}
      {/* ہیڈر ہمیشہ اوپر رہے (sticky/fixed) */}
      <header className="w-full bg-white flex items-center pt-2 pb-1 px-2 sm:px-8 z-50 fixed top-0 left-0 right-0"> {/* ہیڈر سے شیڈو اور گلو ختم */}
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden mr-2 p-2 rounded focus:outline-none hover:bg-gray-100"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* لوگو اور سائٹ نام: دائیں طرف اور درمیان میں فاصلہ */}
        <Link href="/" className="flex items-center gap-4 ml-4 mr-6">
          <img src="/logo.png" alt="Pak EV Logo" className="h-10 w-auto" />
          {/* سائٹ کے نام کی جگہ برانڈنگ امیج */}
          <img src="/Pics/Pak EV Name.png" alt="Pak EV Name" className="h-10 w-auto max-w-[180px] object-contain" />
        </Link>
        {/* سرچ بار (desktop): درمیان میں سنٹر */}
        {/* سرچ بار کا رنگ برانڈنگ اورنج جیسا */}
        <form className="hidden md:flex flex-1 justify-center max-w-lg mx-auto" onSubmit={e => { e.preventDefault(); }}>
          <input
            type="text"
            className="flex-1 rounded-l-full border border-[#FF9100] px-4 py-2 focus:outline-none focus:border-[#FF9100] bg-[#FFF7ED] text-sm placeholder:text-orange-400"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="rounded-r-full bg-[#FF9100] text-white px-4 py-2 font-semibold hover:bg-orange-600 transition">Search</button>
        </form>
        {/* واٹس ایپ بٹن: سرچ بار کے ساتھ دائیں */}
        {/* واٹس ایپ لوگو صرف آئیکن کے طور پر، بغیر کسی بیک گراؤنڈ */}
        <a
          href="https://wa.me/923020029229"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center ml-2"
          title="WhatsApp Chat"
          style={{lineHeight:'1'}}
        >
          {/* کسٹم واٹس ایپ لوگو */}
          {/* سائز بڑا کیا گیا */}
          <img src="/Pics/Whatsapp Logo.png" alt="WhatsApp" width={38} height={38} className="object-contain" />
        </a>
        {/* آئیکنز */}
        <div className="flex items-center gap-3 ml-auto">
          <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={() => setShowSearch(true)} aria-label="Search"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg></button>
          {/* کارٹ، وِش لسٹ اور یوزر آئیکنز کا رنگ تھیم اورنج */}
          <a
            href="https://wa.me/923020029229"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded hover:bg-gray-100 group"
            aria-label="WhatsApp"
          >
            <svg className="w-6 h-6" fill="none" stroke="#25D366" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.374.711.307 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </a>
          <button className="p-2 rounded hover:bg-gray-100 group" aria-label="Cart">
            <svg className="w-6 h-6" fill="none" stroke="#FF9100" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" className="transition-colors duration-150 group-hover:stroke-[#FF9100]" />
            </svg>
          </button>
          <button className="p-2 rounded hover:bg-gray-100 group" aria-label="User">
            <svg className="w-6 h-6" fill="none" stroke="#FF9100" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a8.38 8.38 0 0113 0" className="transition-colors duration-150 group-hover:stroke-[#FF9100]" />
            </svg>
          </button>
        </div>
      </header>

      {/* کیٹیگریز بار: تمام لنکس */}
      {/* کیٹیگریز بار بھی ہمیشہ اوپر (header کے نیچے) */}
      <nav className="hidden md:block w-[1100px] ml-auto bg-[#ffffff] sticky top-[55px] z-40">        {/* مینیو بار دائیں جانب (right aligned) */}
        <div className="flex items-center h-12 px-1 sm:px-4 overflow-x-auto scrollbar-none select-none justify-end">  {/* دائیں طرف مینیو لنکس */}
          {/* دائیں طرف مینیو لنکس */}
          <div className="flex items-center gap-2 h-full">
            <Link href="/" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">
              Home
              <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
            </Link>
            <Link href="/ev-kits" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">
              EV Kits
            <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
          </Link>
          <Link href="/ev-parts" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">
              EV Parts
            <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
          </Link>
          <Link href="/solar-parts" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">
              Solar Parts
            {/* 'Solar' کو 'Solar Parts' کر دیا گیا */}
            <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
          </Link>
          <Link href="/accessories" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">
              Accessories
            <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
          </Link>
          {/* کیلکولیٹر لنکس */}
          <Link href="/ev-calculator" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">EV Calculator
            <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
          </Link>
          <Link href="/load-calculator" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">Load Calculator
            <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
          </Link>
          <Link href="/branches" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">Branches
            <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
          </Link>
          <Link href="/about" className="relative px-4 py-1 text-gray-700 hover:text-[#FF9100] transition-colors duration-150 focus:outline-none group">About Us
            <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded bg-[#FF9100] transition-all duration-200 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 group-focus-within:opacity-100 group-focus-within:scale-x-100" style={{transformOrigin:'center', fontWeight: 'normal'}} />
          </Link>
          {/* مینیو بار کا div بند */}
          </div>
        </div>
      </nav>

      {/* کیٹیگریز ڈراپ ڈاؤن: مینیو بار کے نیچے الگ بلاک */}
      <div className="hidden md:block w-full px-2 sm:px-8 mt-1">
        {/* کیٹیگریز ڈراپ ڈاؤن صرف کلک پر کھلے */}
        {(() => {
          // ڈیسک ٹاپ پر hover پر ڈراپ ڈاؤن کھلے
          const [open, setOpen] = React.useState(false);
          const dropdownRef = React.useRef<HTMLDivElement>(null);

          // باہر کلک کرنے پر ڈراپ ڈاؤن بند کرنے کا ایفیکٹ (صرف موبائل/کلک کے لیے)
          React.useEffect(() => {
            if (!open) return;
            function handleClickOutside(event: MouseEvent) {
              if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
              }
            }
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
          }, [open]);

          return (
            <div
              className="relative inline-block -top-9"
              ref={dropdownRef}
            >
              <button
                className="inline-flex items-center px-4 py-2 text-[#FF9100] font-semibold rounded cursor-pointer select-none transition hover:bg-[#FF9100]/10 focus:outline-none"
                aria-expanded={open}
                aria-haspopup="true"
                tabIndex={0}
                onClick={() => setOpen((v) => !v)}
              >
                {/* تین لائنوں والا hamburger آئیکن */}
                <span className="mr-2 flex flex-col justify-center items-center">
                  <span className="block w-6 h-0.5 bg-[#FF9100] mb-1"></span>
                  <span className="block w-6 h-0.5 bg-[#FF9100] mb-1"></span>
                  <span className="block w-6 h-0.5 bg-[#FF9100]"></span>
                </span>
                Categories
                <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${open ? 'rotate-180 text-[#FF9100]' : 'text-[#FF9100]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {/* ڈراپ ڈاؤن مینیو: hover پر کھلے */}
              {open && (
                <div className="absolute left-0 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
                  <ul className="py-2">
                    <li><Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">Home</Link></li>
                    <li><Link href="/ev-kits" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">EV Kits</Link></li>
                    <li><Link href="/ev-parts" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">EV Parts</Link></li>
                    <li><Link href="/triride" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">TriRide</Link></li>
                    <li><Link href="/ev-batteries" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">EV Batteries</Link></li>
                    <li><Link href="/solar-parts" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">Solar Parts</Link></li>
                    <li><Link href="/solar-batteries" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">Solar Batteries</Link></li>
                    <li><Link href="/solar-inverter" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">Solar Inverter</Link></li>
                    <li><Link href="/mppt-charge-controller" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">MPPT Charge Controller</Link></li>
                    <li><Link href="/12v-charger" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">12V Charger</Link></li>
                    <li><Link href="/dc-breakers" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">DC Breakers</Link></li>
                    <li><Link href="/ac-breakers" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">AC Breakers</Link></li>
                    <li><Link href="/accessories" className="block px-4 py-2 text-gray-700 hover:bg-[#FFF3E0] hover:text-[#FF9100] transition">Accessories</Link></li>
                  </ul>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* سرچ اوورلے (موبائل) */}
      {showSearch && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex justify-center items-start pt-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-4 flex flex-col">
            <button
              className="self-end mb-2 p-2 rounded border border-primary text-primary text-2xl font-bold focus:outline-none"
              onClick={() => setShowSearch(false)}
              aria-label="Close search"
            >×</button>
            <form onSubmit={e => { e.preventDefault(); }}>
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full border border-primary/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </form>
          </div>
        </div>
      )}

      {/* موبائل drawer + overlay */}
      {isMenuOpen && (
        <>
          {/* overlay: پوری اسکرین پر */}
          <div
            className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* classic sidebar drawer */}
          <div className="fixed left-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-lg p-6 flex flex-col gap-2 z-[1000] animate-slideInLeft">
            {/* Close button */}
            <button
              className="self-end mb-4 p-2 rounded border border-primary text-primary text-2xl font-bold focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >×</button>
            {/* برانڈنگ */}
            <div className="flex items-center gap-6 mb-4"> {/* لوگو اور نام کے درمیان اور زیادہ فاصلہ */}
              <img src="/logo.png" alt="Pak EV Logo" className="h-10 w-auto" />
              <span className="font-army text-gradient-orange text-xl font-bold tracking-wide leading-tight whitespace-nowrap flex-shrink-0">PAK EV</span>
            </div>
            {/* مینو لنکس */}
            <Link href="/" className="block text-gray-700 hover:text-primary text-base font-semibold py-2 px-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/branches" className="block text-gray-700 hover:text-primary text-base font-semibold py-2 px-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Branches</Link>
            {/* کیٹیگریز: nested accordion style (alladin.pk style) */}
            <div className="mt-2">
              {/* React state: openIdx for expanded accordion */}
              {/* اردو: کون سی category expand ہے */}
              {categories.map((cat, idx) => (
                <div key={cat.name} className="mb-1">
                  {cat.subcategories ? (
                    <div>
                      <button
                        className="w-full flex justify-between items-center py-2 px-2 rounded text-gray-700 font-semibold hover:text-primary transition"
                        onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        aria-expanded={openIdx === idx}
                        aria-controls={`cat-panel-${idx}`}
                      >
                        <span>{cat.name}</span>
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openIdx === idx ? 'rotate-180 text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <div
                        id={`cat-panel-${idx}`}
                        className={`pl-4 overflow-hidden transition-all duration-200 ${openIdx === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                        style={{ transitionProperty: 'max-height, opacity' }}
                      >
                        {cat.subcategories.map(sub => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block py-2 px-2 rounded text-gray-600 hover:text-primary text-sm transition"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={cat.href}
                      className="block py-2 px-2 rounded text-gray-700 font-semibold hover:text-primary transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            {/* باقی لنکس */}
            <Link href="/ev-calculator" className="block text-gray-700 hover:text-primary text-base font-semibold py-2 px-2 rounded transition" onClick={() => setIsMenuOpen(false)}>EV Calculator</Link>
            <Link href="/load-calculator" className="block text-gray-700 hover:text-primary text-base font-semibold py-2 px-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Load Calculator</Link>
            <Link href="/about" className="block text-gray-700 hover:text-primary text-base font-semibold py-2 px-2 rounded transition" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link href="/cart" className="block text-gray-700 hover:text-primary text-base font-semibold py-2 px-2 rounded transition" onClick={() => setIsMenuOpen(false)}>Cart</Link>
          </div>
        </>
      )}
    </>

  );
}