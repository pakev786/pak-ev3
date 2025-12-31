import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function ProductDisplay() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState(null); // Which order allows this review
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart, user } = useCart(); 
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetch Product
        const prodRes = await axios.get(`${BASE_URL}/api/products`);
        const found = prodRes.data.find(p => p.id === id);
        setProduct(found);
        if (found) setSelectedImage(found.image);

        // Fetch Reviews
        const reviewsRes = await axios.get(`${BASE_URL}/api/reviews/product/${id}`);
        setReviews(reviewsRes.data);

        // Check Eligibility (only if logged in)
        if (user && found) {
            const eligRes = await axios.get(`${BASE_URL}/api/reviews/check-eligibility/${id}/${user.id}`);
            if (eligRes.data.canReview) {
                setCanReview(true);
                setReviewOrderId(eligRes.data.orderId);
            }
        }

      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id, user]);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add items to your cart.");
      navigate('/login');
      return;
    }
    addToCart(product);
    alert(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please login to purchase items.");
      navigate('/login');
      return;
    }
    addToCart(product);
    navigate('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
        const payload = {
            user: user.id,
            product: product.id,
            order: reviewOrderId,
            rating,
            comment
        };
        const res = await axios.post(`${BASE_URL}/api/reviews`, payload);
        setReviews([res.data, ...reviews]);
        setCanReview(false); // Disable form after submission
        setComment('');
    } catch (error) {
        alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
        setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product || (!product.isAvailable && !user?.isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Unavailable</h2>
          <p className="text-gray-500 mb-6">This product is currently not available or has been removed.</p>
          <Link to="/" className="text-orange-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const codTax = Math.round(product.price * 0.04);
  const totalPriceCOD = product.price + codTax;
  const allImages = [product.image, ...(product.extraImages || [])];

  // Stars Helper
  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-orange-500 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/categories" className="hover:text-orange-500 transition">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[500px] w-full flex items-center justify-center relative group">
              <img 
                src={`${BASE_URL}${selectedImage}`} 
                alt={product.title} 
                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=No+Image'; }}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.codAvailable ? (
                  <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 shadow-sm">COD Available</div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 shadow-sm">100% Advance Payment</div>
                )}
                {!product.isAvailable && (
                   <div className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200 shadow-sm">Out of Stock</div>
                )}
              </div>
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-none w-20 h-20 rounded-xl border-2 overflow-hidden bg-white ${selectedImage === img ? 'border-orange-500' : 'border-transparent hover:border-gray-300'} transition-all`}
                  >
                    <img src={`${BASE_URL}${img}`} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div>
            <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-2 block">{product.category?.name || 'Automotive'}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.title}</h1>

            {product.description && (
              <div className="mb-6 text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</div>
            )}

            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-200">
              <span className="text-4xl font-bold text-gray-900">₨ {product.price.toLocaleString()}</span>
              {product.optionalPrice > 0 && (
                <div className="flex flex-col mb-1">
                  <span className="text-gray-400 line-through text-lg">₨ {product.optionalPrice.toLocaleString()}</span>
                  <span className="text-red-500 text-xs font-bold">Save ₨ {(product.optionalPrice - product.price).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Delivery Estimate</p>
                <p className="font-semibold text-gray-800">{product.deliveryTimeMin} - {product.deliveryTimeMax} Days</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Warranty</p>
                <p className="font-semibold text-gray-800">{product.warranty > 0 ? `${product.warranty} Days` : 'No Warranty'}</p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 mb-8">
              <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Payment Terms & Delivery
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between items-center py-2 border-b border-orange-200/50">
                  <span>Base Price</span><span className="font-medium">₨ {product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-200/50">
                  <span className="flex items-center gap-2">Delivery Charges <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">Advance Required</span></span>
                  <span className="font-medium text-red-600">+ ₨ {product.deliveryCharges.toLocaleString()}</span>
                </div>
                {product.codAvailable && (
                  <div className="flex justify-between items-center py-2 border-b border-orange-200/50">
                    <span>COD Tax (4%)</span><span className="font-medium text-red-600">+ ₨ {codTax.toLocaleString()}</span>
                  </div>
                )}
                {product.codAvailable && (
                  <div className="flex justify-between items-center pt-2 font-bold text-gray-900 text-lg">
                    <span>Total (if COD)</span><span>₨ {(totalPriceCOD + product.deliveryCharges).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 text-xs text-orange-800 bg-orange-100 p-3 rounded-lg"><strong>Note:</strong> Delivery charges (₨ {product.deliveryCharges}) must be paid in advance to confirm your order. The remaining amount + 4% tax can be paid via Cash on Delivery.</div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleBuyNow} disabled={!product.isAvailable} className={`flex-1 font-bold py-4 rounded-xl shadow-lg transform transition ${product.isAvailable ? 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>{product.isAvailable ? 'Buy Now' : 'Out of Stock'}</button>
              <button onClick={handleAddToCart} disabled={!product.isAvailable} className={`flex-1 font-bold py-4 rounded-xl border-2 transition shadow-lg transform ${product.isAvailable ? 'bg-white text-black border-black hover:bg-gray-50 hover:-translate-y-1' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}>Add to Cart</button>
            </div>
            
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 text-green-600 font-semibold hover:text-green-700 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Chat on WhatsApp for details
            </a>
          </div>
        </div>

        {/* --- REVIEWS SECTION --- */}
        <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews ({reviews.length})</h2>

            {/* Review Form */}
            {canReview && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-10">
                    <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} transition transform hover:scale-110`}
                                    >
                                        <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Review</label>
                            <textarea
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="Share your experience..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={submittingReview}
                            className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
                        >
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">
                                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="font-bold text-gray-900">{review.user?.name || 'Verified Buyer'}</span>
                                </div>
                                <div className="flex text-yellow-400">
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                            <span className="text-xs text-gray-400 mt-2 block">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                    ))
                )}
            </div>
        </div>

      </main>
    </div>
  );
}