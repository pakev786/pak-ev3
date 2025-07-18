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
    { name: 'Branches', href: '/branches' },
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
        <div className="w-full">
          {/* MOBILE HEADER ROW: Only logo, site name, search, cart, hamburger */}
          {/* ULTRA-MINIMAL MOBILE HEADER: logo, site name, search, cart, hamburger */}
{/*
  یہ mobile header اب ultra-compact اور responsive بنایا گیا ہے:
  - height اور gaps مزید کم کر دی گئی ہیں
  - logo اور site name چھوٹے کر دیے گئے ہیں
  - پانچ چیزیں ایک ہی لائن میں: logo, site name, search, cart (صرف header میں), hamburger
  - Cart icon اب صرف header میں ہے، mobile menu میں نہیں
  - سب کچھ ایک لائن میں tightly fit ہے
*/}
<div className="flex items-center w-full min-w-0 justify-between md:hidden gap-0 px-0" style={{height: '22px'}}>
  <Link href="/" className="flex items-center gap-0 whitespace-nowrap min-w-0">
    <Image src="/Pics/Logo.png" alt="Pak EV Logo" height={10} width={10} className="h-2.5 w-auto flex-shrink-0" priority />
    {/* فونٹ اب Army Wide استعمال ہو رہا ہے۔ */}
{/* اصل Pak EV برانڈنگ کے لیے: Stardos Stencil، ultra-compact سائز، اور Urdu comment */}
<span className="font-army text-[7px] font-bold text-primary tracking-wide leading-tight whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0" style={{letterSpacing: '0.5px', maxWidth: '12px'}}>Pak EV</span>
  </Link>
  <button className="p-0.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary flex-shrink-0" aria-label="Search" type="button">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-2.5 h-2.5 text-gray-700">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
    </svg>
  </button>
  <Link href="/cart" className="relative p-0.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary flex-shrink-0">
    <ShoppingCartIcon className="h-2.5 w-2.5 text-gray-700" />
    <CartBadge />
  </Link>
  <button
    className="text-gray-700 hover:text-primary p-0.5"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    aria-label="Open Menu"
  >
    {isMenuOpen ? (
      <XMarkIcon className="h-2.5 w-2.5" />
    ) : (
      <Bars3Icon className="h-2.5 w-2.5" />
    )}
  </button>
</div>
          {/* DESKTOP HEADER ROW (unchanged) */}
          <div className="hidden md:flex items-center py-4 justify-between w-full min-w-0">
            <div className="flex items-center gap-2 min-w-0 w-full">
              <Link href="/" className="flex items-center gap-1 whitespace-nowrap min-w-0">
                <Image src="/Pics/Logo.png" alt="Pak EV Logo" height={24} width={24} className="h-6 w-auto md:h-8 flex-shrink-0" priority />
                {/* فونٹ اب Army Wide استعمال ہو رہا ہے۔ */}
                <span className="font-army text-5xl font-extrabold pl-2 bg-gradient-to-b from-[#f94211] to-[#f97f14] text-transparent bg-clip-text" style={{lineHeight:1}}>Pak EV</span>
              </Link>
            </div>
            <div className="flex flex-1 items-center">
              <nav className="flex items-center space-x-6 flex-grow justify-start">
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
              <div className="flex items-center justify-end min-w-[56px]">
                <div style={{background: 'red', color: 'white', padding: '6px 18px', borderRadius: '10px', fontWeight: 'bold'}}>CART</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            {/*
              موبائل مینو میں اب Cart بالکل نہیں آئے گا، صرف header پر ہے
            */}
            <nav className="flex flex-col space-y-4">
              {navigation.filter(item => item.name !== 'Cart').map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
