import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logoutUser } = useCart(); 
  const [activeTab, setActiveTab] = useState('orders');
  
  const [orders, setOrders] = useState([]);
  const [warranties, setWarranties] = useState([]);
  
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWarranties, setLoadingWarranties] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchOrders();
      fetchWarranties();
    }
  }, [user, navigate]);

  // Poll for chat
  useEffect(() => {
    let interval;
    if (activeTab === 'chat' && user) {
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    }
    return () => clearInterval(interval);
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/user/${user.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchWarranties = async () => {
    if (!user) return;
    setLoadingWarranties(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/warranties/user/${user.id}`);
      setWarranties(response.data);
    } catch (error) {
      console.error('Error fetching warranties:', error);
    } finally {
      setLoadingWarranties(false);
    }
  };

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/${user.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const payload = {
        sender: user.id,
        receiver: "ADMIN",
        message: newMessage
      };
      
      const response = await axios.post(`${BASE_URL}/api/chat`, payload);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutUser(); 
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-500 mt-1">Hello, <span className="font-semibold text-black">{user.name}</span></p>
              <p className="text-sm text-gray-400">{user.email || user.phone}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-6 md:mt-0 px-6 py-2 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition"
          >
            Log Out
          </button>
        </div>

        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['orders', 'warranties', 'chat'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-bold capitalize whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-black text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200'
              }`}
            >
              {tab === 'chat' ? 'Support Chat' : tab === 'orders' ? 'My Orders' : 'Warranties'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px] animate-fade-in">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            loadingOrders ? (
              <div className="flex justify-center items-center h-64 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">📦</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Past Orders</h2>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold">Browse Products</button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <span className="text-xs text-gray-400 font-bold uppercase">Order ID</span>
                        <p className="font-mono font-bold text-gray-800">#{order.id.slice(-6)}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit mb-1 ${
                          order.status === 'Verified' ? 'bg-green-100 text-green-700' :
                          order.status === 'Delivered' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Declined' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-lg font-bold">₨ {order.totalCost.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.quantity}x {item.title}</span>
                          <span className="font-medium">₨ {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    {order.deliveryTime && (
                      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        Expected Delivery: <span className="font-bold text-gray-900">{new Date(order.deliveryTime).toDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* WARRANTIES TAB */}
          {activeTab === 'warranties' && (
            loadingWarranties ? (
              <div className="flex justify-center items-center h-64 text-gray-400">Loading warranties...</div>
            ) : warranties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🛡️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Warranties</h2>
                <p className="text-gray-500 mb-6">Purchased items with warranties will appear here after your order is verified.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {warranties.map(warranty => (
                  <div key={warranty.id} className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-orange-400 text-xs font-bold uppercase tracking-wider">Warranty Card</p>
                          <h3 className="text-xl font-bold mt-1">{warranty.productName}</h3>
                        </div>
                        <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-mono">
                          QTY: {warranty.quantity}
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-4 mt-2">
                        <p className="text-xs text-gray-400 uppercase">Valid Until</p>
                        <p className="text-lg font-bold text-orange-400">{new Date(warranty.validUntil).toDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="h-full">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🔒</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Required</h2>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Customer support chat is exclusively available to customers with at least one order. Please place an order to unlock this feature.
                  </p>
                  <button onClick={() => navigate('/')} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold">Browse Products</button>
                </div>
              ) : (
                <div className="flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-400 py-10">Start a conversation with our support team.</p>
                    ) : (
                      messages.map((msg, idx) => {
                        const isMe = msg.sender === user.id;
                        return (
                          <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                              <p>{msg.message}</p>
                              <span className={`text-[10px] block mt-1 ${isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <button 
                      type="submit" 
                      className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}