import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false); 
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false); 
  const [categories, setCategories] = useState([]);
  const [navbarCategories, setNavbarCategories] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('923001234567'); // Default
  const [searchQuery, setSearchQuery] = useState(''); // Search State

  const { user, getCartCount } = useCart();
  const cartCount = getCartCount();

  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const API_URL = `${BASE_URL}/api/categories`;
  const SETTINGS_API = `${BASE_URL}/api/settings`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, settingsRes] = await Promise.all([
          axios.get(API_URL),
          axios.get(`${SETTINGS_API}/whatsapp`)
        ]);
        
        // Categories
        setCategories(catsRes.data);
        setNavbarCategories(catsRes.data.filter(c => c.inNavbar));
        
        // WhatsApp
        if (settingsRes.data.number) {
          setWhatsappNumber(settingsRes.data.number);
        }
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleCartClick = () => {
    if (user) {
        navigate('/cart');
    } else {
        navigate('/login');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false); // Close mobile search if open
    }
  };

  const baseLinks = [
    { name: 'EV Calculator', path: '/ev-calculator' },
    { name: 'Load Calculator', path: '/load-calculator' },
    { name: 'Branches', path: '/branches' },
    { name: 'About Us', path: '/about-us' }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleCategories = (e) => {
    e.preventDefault();
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left Side: Mobile Menu + Logo */}
          <div className="flex items-center gap-3 md:gap-0">
            {/* Mobile Hamburger Menu (Left Aligned) */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-1 rounded-full hover:bg-orange-500 transition-all duration-300 focus:outline-none"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo and Company Name */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Company Logo" 
                className="h-08 w-12 md:h-12 md:w-20 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {/* Name hidden on mobile, visible on medium screens and up */}
              <h1 className="hidden md:block text-xl md:text-2xl font-bold text-orange-500 whitespace-nowrap">
                Pak EV
              </h1>
            </Link>
          </div>

          {/* Center: Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Side: Icons (Visible on Mobile & Desktop) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Mobile Search Toggle */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 rounded-full hover:bg-orange-500 transition-all duration-300"
              aria-label="Search"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* WhatsApp Icon */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-110"
              aria-label="WhatsApp"
            >
              <svg
                className="h-6 w-6 text-white hover:text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>

            {/* Cart Icon */}
            <button
              onClick={handleCartClick}
              className="p-2 rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-110 relative"
              aria-label="Shopping Cart"
            >
              <svg
                className="h-6 w-6 text-white hover:text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-75 md:scale-90">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Icon */}
            <button
              onClick={handleProfileClick}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                user ? 'bg-orange-500 text-black' : 'hover:bg-orange-500 hover:text-black text-white'
              }`}
              aria-label="User Profile"
              title={user ? `Logged in as ${user.name}` : "Login"}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="md:hidden mt-3 pb-2 transform transition-all duration-300 ease-in-out animate-fade-in-down">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Navigation Links Bar - Desktop */}
      <div className="hidden md:block bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            
            {/* Home Link */}
            <Link
              to="/"
              className="px-6 py-3 text-black font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 border-r border-gray-200"
            >
              Home
            </Link>

            {/* Categories Dropdown (Non-navigable button) */}
            <div 
              className="relative group h-full"
              onMouseEnter={() => setIsDesktopDropdownOpen(true)}
              onMouseLeave={() => setIsDesktopDropdownOpen(false)}
            >
              {/* Changed from Link to button-like div (or span) to prevent navigation */}
              <div
                className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-all duration-300 border-r border-gray-200 h-full cursor-pointer
                  ${isDesktopDropdownOpen ? 'bg-orange-500 text-white' : 'text-black hover:bg-orange-500 hover:text-white'}`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <span>Categories</span>
              </div>

              {/* Dropdown Menu */}
              {isDesktopDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl border-t-4 border-orange-500 z-50 animate-fade-in">
                  {categories.length > 0 ? (
                    <ul className="py-2">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link 
                            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                            className="block px-6 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100 last:border-0"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No categories found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Selected Categories */}
            {navbarCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-3 text-black font-medium whitespace-nowrap hover:bg-orange-500 hover:text-white transition-all duration-300 border-r border-gray-200"
              >
                {cat.name}
              </Link>
            ))}

            {/* Fixed Links */}
            <div className="flex items-center overflow-x-auto">
              {baseLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="px-4 py-3 text-black font-medium whitespace-nowrap hover:bg-orange-500 hover:text-white transition-all duration-300 border-r border-gray-200 last:border-r-0"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-black border-t border-gray-200 transform transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 py-4">
            
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-black font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-lg mb-1"
            >
              Home
            </Link>

            {/* Categories Section - Single Button (Toggle Only, No Navigation) */}
            <button
              onClick={toggleCategories}
              className="w-full flex items-center justify-between px-4 py-3 mb-2 font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-lg text-left"
            >
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Categories</span>
              </div>
              <svg
                className={`h-4 w-4 transform transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mobile Categories List */}
            {isCategoriesOpen && (
              <div className="ml-4 mt-2 border-l-2 border-orange-200 space-y-1 mb-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors rounded-r-lg"
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No categories available
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Navbar Categories */}
             {navbarCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-black font-medium hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-lg"
              >
                {cat.name}
              </Link>
            ))}

            {/* Fixed Links */}
            <div className="space-y-1">
              {baseLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-black font-medium hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;