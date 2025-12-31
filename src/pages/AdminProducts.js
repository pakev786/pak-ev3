import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import AddProduct from '../components/AddProduct';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = 'http://localhost:5000/api/products';
  // Base URL for images
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showMessage('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setProducts(prev => prev.filter(p => p.id !== id));
        showMessage('success', 'Product deleted successfully');
      } catch (error) {
        showMessage('error', 'Failed to delete product');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSuccess = () => {
    fetchProducts(); 
    handleModalClose();
    showMessage('success', productToEdit ? 'Product updated successfully' : 'Product created successfully');
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Helper to construct image URL safely
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300?text=No+Image';
    // Ensure path has leading slash if missing (though backend should add it)
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminNavbar active="products" />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Products Inventory</h1>
            <p className="text-gray-600">
              Manage your catalog, prices, and stock
            </p>
          </div>
          
          <button 
            onClick={handleAddClick}
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-1"
          >
            <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-300">+</span>
            <span>Add Product</span>
          </button>
        </div>

        {/* Toast Notification */}
        {message.text && (
          <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border-l-8 ${
            message.type === 'success' ? 'bg-white border-green-500 text-gray-800' : 'bg-white border-red-500 text-gray-800'
          }`}>
            <span className={`text-2xl ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {message.type === 'success' ? '✓' : '⚠'}
            </span>
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Content Area */}
        {isModalOpen ? (
          <div className="relative">
            <button 
              onClick={handleModalClose}
              className="absolute top-0 right-0 md:-right-4 md:-top-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-600 transition z-10"
            >
              ✕
            </button>
            <AddProduct 
              onCancel={handleModalClose}
              onSuccess={handleSuccess}
              productToEdit={productToEdit}
            />
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Yet</h3>
                <p className="text-gray-500 mb-6">Start building your catalog by adding your first product.</p>
                <button onClick={handleAddClick} className="text-orange-600 font-bold hover:underline">Create Product Now</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative group">
                    
                    {/* Image Area with Overlay Actions */}
                    <div className="relative h-64 bg-white p-4 flex items-center justify-center">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.title} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Error+Loading'; }}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                         {product.section && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                            {product.section.name}
                          </span>
                        )}
                      </div>
                      
                      {/* FIXED: Check if optionalPrice > 0 before showing 'Sale' */}
                      {product.optionalPrice > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          Sale
                        </div>
                      )}
                      
                      {/* ACTION OVERLAY */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product.id)}
                          className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col border-t border-gray-100 bg-gray-50/50">
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                        {product.category?.name || 'Uncategorized'}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2" title={product.title}>
                        {product.title}
                      </h3>
                      
                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <p className="text-xl font-bold text-black">
                            ₨ {product.price.toLocaleString()}
                          </p>
                          {/* FIXED: Check if optionalPrice > 0 */}
                          {product.optionalPrice > 0 && (
                            <p className="text-sm text-gray-400 line-through">
                              ₨ {product.optionalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}