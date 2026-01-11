import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unverified');
  const [zoomedImage, setZoomedImage] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const API_URL = `${BASE_URL}/api/orders`;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

    try {
      const res = await axios.put(`${API_URL}/${id}/status`, { status: newStatus });
      setOrders(prev => prev.map(order => 
        order.id === id ? res.data : order
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const unverifiedOrders = orders.filter(o => o.status === 'Non Verified');
  const verifiedOrders = orders.filter(o => o.status === 'Verified' || o.status === 'Delivered');

  // Let's stick to tabs logic if previous tabs existed, or simplified:
  const processedOrders = orders.filter(o => o.status === 'Verified');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  let currentOrders = [];
  if (activeTab === 'unverified') currentOrders = unverifiedOrders;
  if (activeTab === 'processed') currentOrders = processedOrders;
  if (activeTab === 'delivered') currentOrders = deliveredOrders;

  const StatusBadge = ({ status }) => {
    let color = 'bg-gray-100 text-gray-800';
    if (status === 'Verified') color = 'bg-green-100 text-green-800';
    if (status === 'Delivered') color = 'bg-blue-100 text-blue-800';
    if (status === 'Declined') color = 'bg-red-100 text-red-800';
    if (status === 'Non Verified') color = 'bg-yellow-100 text-yellow-800';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <AdminNavbar active="orders" />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Manage Orders</h1>

        <div className="flex space-x-4 mb-8 border-b border-gray-200 pb-1 overflow-x-auto">
          <button onClick={() => setActiveTab('unverified')} className={`pb-3 px-4 text-lg font-bold transition-colors border-b-4 whitespace-nowrap ${activeTab === 'unverified' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            Unverified <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full ml-2">{unverifiedOrders.length}</span>
          </button>
          <button onClick={() => setActiveTab('processed')} className={`pb-3 px-4 text-lg font-bold transition-colors border-b-4 whitespace-nowrap ${activeTab === 'processed' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            Processed <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full ml-2">{processedOrders.length}</span>
          </button>
          <button onClick={() => setActiveTab('delivered')} className={`pb-3 px-4 text-lg font-bold transition-colors border-b-4 whitespace-nowrap ${activeTab === 'delivered' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            Delivered <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full ml-2">{deliveredOrders.length}</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading orders...</div>
        ) : currentOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100">
            No orders found in this section.
          </div>
        ) : (
          <div className="space-y-6">
            {currentOrders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8">
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Order #{order.id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                    <div>
                      <span className="block text-gray-400 text-xs uppercase font-bold">Customer</span>
                      <span className="font-semibold block">{order.user?.name || 'Unknown'}</span>
                      <span className="text-gray-500">{order.user?.email}</span>
                      
                      {/* NEW: Recipient Details */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                         <span className="block text-gray-400 text-xs uppercase font-bold">Recipient & Shipping</span>
                         <div className="font-bold text-gray-900">{order.recipientName}</div>
                         <div className="text-gray-800 font-medium">{order.contactNumber}</div>
                         <div className="text-gray-600 text-xs mt-1 leading-snug">
                           {order.shippingAddress}, {order.postalCode}
                         </div>
                      </div>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase font-bold">Payment Method</span>
                      <span className="font-semibold">{order.codAmount > 0 ? 'COD + Advance' : 'Full Online'}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase font-bold">Bank Used</span>
                      <span className="font-semibold">{order.bankAccount?.bankName}</span>
                      <div className="text-xs text-gray-500">{order.bankAccount?.accountNumber}</div>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase font-bold">Amounts</span>
                      <div className="flex justify-between">
                        <span>Paid Online:</span> <span className="font-bold text-green-600">₨ {order.onlinePaid.toLocaleString()}</span>
                      </div>
                      {order.codAmount > 0 && (
                        <div className="flex justify-between">
                          <span>To Collect:</span> <span className="font-bold text-orange-600">₨ {order.codAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-bold text-sm text-gray-700 mb-2">Items ({order.products.length})</h4>
                    <ul className="space-y-2">
                      {order.products.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.quantity}x {item.title}</span>
                          <span className="font-medium">₨ {(item.price * item.quantity).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                      <span>Total Value</span>
                      <span>₨ {order.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-80 flex flex-col gap-4">
                  {order.paymentScreenshot ? (
                    <div className="bg-gray-100 rounded-xl overflow-hidden relative group h-48 lg:h-64 flex items-center justify-center border border-gray-200">
                      {order.paymentScreenshot.endsWith('.pdf') ? (
                        <a href={`${BASE_URL}${order.paymentScreenshot}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">
                          View PDF Receipt
                        </a>
                      ) : (
                        <img 
                          src={`${BASE_URL}${order.paymentScreenshot}`} 
                          alt="Payment Proof" 
                          className="w-full h-full object-contain cursor-pointer transition hover:opacity-90"
                          onClick={() => setZoomedImage(`${BASE_URL}${order.paymentScreenshot}`)}
                        />
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Click to Zoom
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 h-48 flex items-center justify-center text-gray-400 rounded-xl border border-dashed border-gray-200">
                      Receipt Deleted
                    </div>
                  )}

                  {/* Actions */}
                  {order.status === 'Non Verified' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleStatusUpdate(order.id, 'Verified')} className="bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-md">Verify</button>
                      <button onClick={() => handleStatusUpdate(order.id, 'Declined')} className="bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition border border-red-100">Decline</button>
                    </div>
                  )}
                  {order.status === 'Verified' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'Delivered')} className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md">Mark as Delivered</button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {zoomedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer" onClick={() => setZoomedImage(null)}>
            <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full rounded-lg shadow-2xl" />
            <button className="absolute top-4 right-4 text-white text-4xl">&times;</button>
          </div>
        )}

      </main>
    </div>
  );
}