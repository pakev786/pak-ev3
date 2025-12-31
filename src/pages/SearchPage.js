import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get query param from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/products/search?q=${query}`);
        // Filter out unavailable products from search results
        setProducts(response.data.filter(p => p.isAvailable));
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for <span className="text-orange-600">"{query}"</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Matches Found</h3>
            <p className="text-gray-500 mb-6">
                We couldn't find any products matching <strong>"{query}"</strong>. 
                <br/>Try searching for something else or browse categories.
            </p>
            <Link to="/categories" className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-orange-600 transition">
              Browse Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
                <div className="relative h-64 bg-white p-4 flex items-center justify-center">
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
                <div className="p-5 flex-1 flex flex-col border-t border-gray-100 bg-gray-50/50">
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">
                    {product.category?.name || 'Uncategorized'}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors" title={product.title}>
                    {product.title}
                  </h3>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-xl font-bold text-black">
                        ₨ {product.price.toLocaleString()}
                      </p>
                      {product.optionalPrice > 0 && (
                        <p className="text-sm text-gray-400 line-through">
                          ₨ {product.optionalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition shadow-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}