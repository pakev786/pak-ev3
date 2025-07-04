'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import LiveSearchResults from './LiveSearchResults'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from './CartContext'
import CartBadge from './CartBadge'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [search, setSearch] = useState("");

  // Close search modal on ESC
  React.useEffect(() => {
    if (!showSearch) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showSearch]);

  return (
    <nav className="backdrop-blur-lg bg-white/70 shadow-lg fixed w-full z-50 border-b-0">
      {/* Animated gradient border */}
      <div className="absolute left-0 right-0 bottom-0 h-1 z-50">
        <div className="w-full h-full animate-gradient-x bg-gradient-to-r from-primary via-green-400 to-blue-400 bg-[length:200%_100%]" style={{borderRadius:2}} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center gap-8 group">
              <img src="/logo.png" alt="Pak EV Logo" className="h-16 w-auto" />
              <span className="text-5xl font-extrabold pl-2 bg-gradient-to-b from-[#f94211] to-[#f97f14] text-transparent bg-clip-text" style={{ fontFamily: 'Stencil Std, Stencil, sans-serif', lineHeight: '1' }}>
                Pak EV
              </span>
            </Link>

          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Cart Icon (desktop) */}
            <Link href="/cart" className="relative ml-2 flex items-center group">
              <ShoppingCartIcon className="h-7 w-7 text-gray-700 hover:text-primary transition-colors" />
              <CartBadge />
            </Link>
            {/* Cart Icon */}
            {/* Search Icon */}
            <button
              className="p-2 rounded-full hover:bg-primary/10 transition-colors focus:outline-none mr-2"
              aria-label="Search"
              onClick={() => setShowSearch(true)}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            {[{href:"/",label:"Home"},{href:"/branches",label:"Branches"}].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-primary via-green-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
              </Link>
            ))}
            <div className="relative group">
              <button className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                EV Products
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible invisible transition-all duration-300 z-50">
                <div className="py-1">
                  <Link href="/ev-parts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition">EV Parts</Link>
                  <Link href="/ev-kits" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition">EV Kits</Link>
                  <Link href="/blog/triride-success-stories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition">TriRide</Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                Solar Products
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible invisible transition-all duration-300 z-50">
                <div className="py-1">
                  <Link href="/solar-parts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition">Solar Parts</Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                Batteries
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible invisible transition-all duration-300 z-50">
                <div className="py-1">
                  <Link href="/ev-batteries" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition">EV Batteries</Link>
                  <Link href="/solar-batteries" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition">Solar Batteries</Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                Calculators
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible invisible transition-all duration-300 z-50">
                <div className="py-1">
                  <Link href="/ev-calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition">EV Calculator</Link>
                  <Link href="/load-calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition">Load Calculator</Link>
                </div>
              </div>
            </div>
            <Link
              href="/about"
              className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group"
            >
              About Us
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-primary via-green-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
            </Link>

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <div className="py-2">
              <div className="text-gray-600 px-3 py-2 text-base font-medium">EV Products</div>
              <Link href="/ev-parts" className="block pl-6 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>EV Parts</Link>
              <Link href="/ev-kits" className="block pl-6 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>EV Kits</Link>
              <Link href="/blog/triride-success-stories" className="block pl-6 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>TriRide</Link>
            </div>
            <div className="py-2">
              <div className="text-gray-600 px-3 py-2 text-base font-medium">Solar Products</div>
              <Link href="/solar-parts" className="block pl-6 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Solar Parts</Link>
            </div>
            <div className="py-2">
              <div className="text-gray-600 px-3 py-2 text-base font-medium">Batteries</div>
              <Link href="/ev-batteries" className="block pl-6 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>EV Batteries</Link>
              <Link href="/solar-batteries" className="block pl-6 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Solar Batteries</Link>
            </div>
            <div className="py-2">
              <div className="text-gray-600 px-3 py-2 text-base font-medium">Calculators</div>
              <Link href="/ev-calculator" className="block pl-6 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>EV Calculator</Link>
              <Link href="/load-calculator" className="block pl-6 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Load Calculator</Link>
            </div>
            <Link
              href="/about"
              className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            {/* Cart Icon (mobile) */}
            <Link
              href="/cart"
              className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="inline-flex items-center">
                <ShoppingCartIcon className="h-6 w-6 mr-1" />
                Cart
                <CartBadge />
              </span>
            </Link>
            {/* Cart Icon (mobile) */}
            <Link
              href="/cart"
              className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="inline-flex items-center">
                <ShoppingCartIcon className="h-6 w-6 mr-1" />
                Cart
                <CartBadge />
              </span>
            </Link>
          </div>
        </div>
      )}
    {/* Search Overlay */}
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
          {/* Live Results Dropdown */}
          <LiveSearchResults query={search} onClose={() => setShowSearch(false)} />
        </div>
      </div>
    )}
    </nav>
  )
}
