"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// Pak EV Navigation/Header Component
export default function Navigation() {
  // مینو اور سرچ اسٹیٹ
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  // موبائل مینیو یا سرچ اوورلے اوپن ہونے پر body scroll disable
  React.useEffect(() => {
    if (isMenuOpen || showSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // صفائی (cleanup)
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen, showSearch]);

  return (
    <nav className="backdrop-blur-lg bg-white/70 shadow-lg fixed w-full z-50 border-b-0 h-14 sm:h-16 flex items-center">
      {/* برانڈنگ: Army Wide + Orange Gradient */}
      <div className="flex items-center gap-2 px-4">
        <img src="/logo.png" alt="Pak EV Logo" className="h-10 w-auto" />
        <span className="font-army text-gradient-orange text-xl font-bold tracking-wide leading-tight whitespace-nowrap flex-shrink-0" style={{letterSpacing: '1px', maxWidth: '110px'}}>PAK EV</span>
      </div>

      {/* Desktop menu links */}
      <div className="hidden md:flex items-center space-x-2 ml-6">
        <Link href="/" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          Home
          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-primary via-orange-400 to-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
        </Link>
        <Link href="/branches" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          Branches
          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-primary via-orange-400 to-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
        </Link>
        <Link href="/ev-parts" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          EV Parts
        </Link>
        <Link href="/ev-kits" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          EV Kits
        </Link>
        <Link href="/solar-parts" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          Solar Parts
        </Link>
        <Link href="/ev-batteries" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          EV Batteries
        </Link>
        <Link href="/solar-batteries" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          Solar Batteries
        </Link>
        <Link href="/ev-calculator" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          EV Calculator
        </Link>
        <Link href="/load-calculator" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          Load Calculator
        </Link>
        <Link href="/about" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group">
          About Us
        </Link>
      </div>

      {/* سرچ بٹن اور کارٹ */}
      <div className="flex items-center ml-auto gap-2 px-4">
        <button onClick={() => setShowSearch(true)} className="p-2 rounded-full hover:bg-primary/10 text-gray-500 hover:text-primary transition" title="Search">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
        </button>
        <Link href="/cart" className="p-2 rounded-full hover:bg-primary/10 text-gray-500 hover:text-primary transition" title="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.5 19h9a2 2 0 001.85-2.7L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
          </svg>
        </Link>
      </div>

      {/* موبائل مینو بٹن */}
      <div className="md:hidden flex items-center px-2">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          <span className="sr-only">Open main menu</span>
          {!isMenuOpen ? (
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* موبائل مینو */}
      {isMenuOpen && (
  // موبائل مینیو اوپن: overlay پر click سے مینیو بند، drawer w-full max-w-xs
  <div className="fixed inset-0 z-[999] flex">
    {/* overlay */}
    <div
      className="flex-1 bg-black/40 backdrop-blur-sm"
      onClick={() => setIsMenuOpen(false)}
    />
    {/* drawer */}
    <div className="relative bg-white h-full shadow-lg p-4 flex flex-col gap-2 w-full max-w-xs animate-slideInLeft">
      {/* برانڈنگ */}
      <div className="flex items-center gap-2 mb-4">
        <img src="/logo.png" alt="Pak EV Logo" className="h-10 w-auto" />
        <span className="font-army text-gradient-orange text-xl font-bold tracking-wide leading-tight whitespace-nowrap flex-shrink-0">PAK EV</span>
      </div>
      {/* مینو لنکس */}
      <Link href="/" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
      <Link href="/branches" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Branches</Link>
      <Link href="/ev-parts" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>EV Parts</Link>
      <Link href="/ev-kits" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>EV Kits</Link>
      <Link href="/solar-parts" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Solar Parts</Link>
      <Link href="/ev-batteries" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>EV Batteries</Link>
      <Link href="/solar-batteries" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Solar Batteries</Link>
      <Link href="/ev-calculator" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>EV Calculator</Link>
      <Link href="/load-calculator" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Load Calculator</Link>
      <Link href="/about" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>About Us</Link>
      <Link href="/cart" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Cart</Link>
    </div>
  </div>
)}

      {/* سرچ اوورلے */}
      {showSearch && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm">
          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg w-full sm:max-w-md mx-4 p-6 flex flex-col justify-start">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-primary text-2xl font-bold focus:outline-none"
              onClick={() => setShowSearch(false)}
              aria-label="Close search"
            >
              ×
            </button>
            <form onSubmit={e => { e.preventDefault(); }}>
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full border border-primary/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
            </form>
            {/* Live Results Dropdown (اگر آپ کے پاس الگ component ہے تو import کریں) */}
            {/* <LiveSearchResults query={search} onClose={() => setShowSearch(false)} /> */}
          </div>
        </div>
      )}
    </nav>
  );
}