import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { user, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  const [paymentMethod, setPaymentMethod] = useState('online');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const isCodEligible = cartItems.length > 0 && cartItems.every(item => item.codAvailable);

  useEffect(() => {
    if (!isCodEligible) {
      setPaymentMethod('online');
    }
  }, [isCodEligible, cartItems]);

  if (!user) return null;

  const subtotal = getCartTotal();
  const totalDeliveryCharges = cartItems.reduce((total, item) => total + (item.deliveryCharges || 0), 0);
  const codTax = paymentMethod === 'cod' ? Math.round(subtotal * 0.04) : 0;
  const grandTotal = subtotal + totalDeliveryCharges + codTax;

  const handleCheckout = () => {
    navigate('/checkout', { state: { paymentMethod } });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
            <Link to="/" className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
                  {!item.codAvailable && (
                    <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-br-lg">
                      Online Payment Only
                    </div>
                  )}
                  
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 mt-4 sm:mt-0">
                    <img 
                      src={`${BASE_URL}${item.image}`} 
                      alt={item.title} 
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">Unit Price: ₨ {item.price.toLocaleString()}</p>
                    {item.deliveryCharges > 0 && (
                      <p className="text-xs text-orange-600 mt-1">Delivery: ₨ {item.deliveryCharges}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full font-bold">-</button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full font-bold">+</button>
                  </div>

                  <div className="text-right min-w-[100px] flex flex-col items-center sm:items-end">
                    <span className="font-bold text-lg">₨ {(item.price * item.quantity).toLocaleString()}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:text-red-700 mt-1 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-96">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                  <button onClick={() => setPaymentMethod('online')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'online' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Online Payment</button>
                  <button onClick={() => isCodEligible && setPaymentMethod('cod')} disabled={!isCodEligible} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'cod' ? 'bg-white shadow-sm text-black' : isCodEligible ? 'text-gray-500' : 'text-gray-300 cursor-not-allowed'}`}>Cash on Delivery</button>
                </div>

                {!isCodEligible && (
                  <div className="mb-6 bg-blue-50 text-blue-700 text-xs p-3 rounded-lg border border-blue-100">
                    Some items in your cart are not eligible for Cash on Delivery. Please pay online.
                  </div>
                )}

                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">₨ {subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Delivery Charges</span><span className="font-medium text-gray-900">₨ {totalDeliveryCharges.toLocaleString()}</span></div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-orange-600 bg-orange-50 px-2 py-1 rounded"><span>COD Tax (4%)</span><span>+ ₨ {codTax.toLocaleString()}</span></div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                  <span className="font-bold text-xl text-gray-900">₨ {grandTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mb-6 text-right">Includes COD tax & delivery</p>

                {paymentMethod === 'cod' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm">
                    <p className="font-bold text-gray-800 mb-2">Payment Breakdown:</p>
                    <div className="flex justify-between mb-1"><span className="text-red-600 font-semibold">Pay Now (Advance):</span><span className="font-bold">₨ {totalDeliveryCharges.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-green-700 font-semibold">Pay on Delivery:</span><span className="font-bold">₨ {(subtotal + codTax).toLocaleString()}</span></div>
                    <p className="text-xs text-gray-400 mt-2">* Delivery charges must be paid in advance to confirm COD orders.</p>
                  </div>
                )}

                <div className="mt-6">
                  <button 
                    className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-lg transform hover:-translate-y-1"
                    onClick={handleCheckout}
                  >
                    {paymentMethod === 'cod' ? 'Confirm COD Order' : 'Pay Securely Now'}
                  </button>
                </div>

                <p className="text-xs text-center text-gray-400 mt-4">Secure Checkout powered by Pak EV</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}