'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from './CartContext'
import CartBadge from './CartBadge'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'EV Parts', href: '/ev-parts' },
    { name: 'Pak TriRide', href: '/pak-triride' },
    { name: 'EV Batteries', href: '/ev-batteries' },
    { name: 'Solar Batteries', href: '/solar-batteries' },
    { name: 'Solar Parts', href: '/solar-parts' },
    { name: 'EV Calculator', href: '/ev-calculator' },
    { name: 'Load Calculator', href: '/load-calculator' },
    { name: 'About Us', href: '/about' },
  ]

  return (
    <header className="bg-white shadow-sm" style={{boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>📧 info@pakev.com</span>
              <span>📞 +92 300 1234567</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/about" className="hover:text-white/80 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-white/80 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center py-4 justify-between">
          {/* Logo */}
          <div className="flex items-center justify-between w-full min-w-0">
  <Link href="/" className="flex items-center gap-1 min-w-0">
    <Image src="/Pics/Logo.png" alt="Pak EV Logo" height={28} width={28} className="h-6 w-auto md:h-12 flex-shrink-0" priority />
    <span className="text-lg md:text-2xl font-bold" style={{color: '#ff6600', fontFamily: 'inherit', letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>PAK EV</span>
  </Link>
  <div className="flex items-center gap-1">
    <Link href="/cart" className="p-2 relative rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
      <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
      <CartBadge />
    </Link>
    <button
      className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Search"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
      </svg>
    </button>
  </div>
</div>


          {/* Navigation links and cart as flex row */}
          <div className="flex flex-1 items-center">
            <nav className="hidden md:flex items-center space-x-6 flex-grow justify-start">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* Cart Icon always at far right */}
            <div className="hidden md:flex items-center justify-end min-w-[56px]">
              <div style={{background: 'red', color: 'white', padding: '6px 18px', borderRadius: '10px', fontWeight: 'bold'}}>CART</div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Cart Icon */}
              <Link href="/cart" className="relative mt-4 w-max">
                <ShoppingCartIcon className="h-7 w-7 text-gray-700 hover:text-primary transition-colors" />
                <CartBadge />
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
