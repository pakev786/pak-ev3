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
  const [attachment, setAttachment] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchOrders();
      fetchWarranties();
    }
  }, [user, navigate]);

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
    if (!newMessage.trim() && !attachment) return;

    try {
      const formData = new FormData();
      formData.append('sender', user.id);
      formData.append('receiver', "ADMIN");
      formData.append('message', newMessage);
      if (attachment) {
        formData.append('attachment', attachment);
      }
      
      const response = await axios.post(`${BASE_URL}/api/chat`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutUser(); 
      navigate('/');
    }
  };

  const renderMessageContent = (message) => {
    const imageRegex = /(\/uploads\/[a-zA-Z0-9_\-./]+\.(png|jpg|jpeg|webp|gif))/i;
    const match = message.match(imageRegex);

    if (match) {
      const imagePath = match[0];
      const textPart = message.replace(imagePath, '').trim();

      return (
        <div className="flex flex-col gap-2">
          {textPart && <p className="whitespace-pre-wrap">{textPart}</p>}
          <div className="rounded-lg overflow-hidden border border-white/20 mt-1 cursor-pointer bg-black/20" onClick={() => setZoomedImage(`${BASE_URL}${imagePath}`)}>
            <img 
              src={`${BASE_URL}${imagePath}`} 
              alt="Attachment" 
              className="max-w-full h-auto max-h-64 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        </div>
      );
    }
    return <p className="whitespace-pre-wrap">{message}</p>;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          {/* ... Header Content ... */}
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
          <button onClick={handleLogout} className="mt-6 md:mt-0 px-6 py-2 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition">Log Out</button>
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
          
          {/* ORDERS & WARRANTIES TABS (Same as before) */}
          {activeTab === 'orders' && (
            loadingOrders ? <div className="flex justify-center items-center h-64 text-gray-400">Loading orders...</div> : 
            orders.length === 0 ? <div className="text-center py-20 text-gray-400">No Past Orders</div> :
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
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'warranties' && (
            loadingWarranties ? <div className="flex justify-center items-center h-64 text-gray-400">Loading warranties...</div> :
            warranties.length === 0 ? <div className="text-center py-20 text-gray-400">No Active Warranties</div> :
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {warranties.map(warranty => (
                  <div key={warranty.id} className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mt-1">{warranty.productName}</h3>
                      <div className="border-t border-white/10 pt-4 mt-2">
                        <p className="text-xs text-gray-400 uppercase">Valid Until</p>
                        <p className="text-lg font-bold text-orange-400">{new Date(warranty.validUntil).toDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
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
                              {renderMessageContent(msg.message)}
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
                  
                  <form onSubmit={handleSendMessage} className="flex gap-2 p-2 border border-gray-200 rounded-2xl bg-gray-50">
                    {/* Attachment Preview */}
                    {attachment && (
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-gray-200 text-xs">
                            <span className="truncate max-w-[100px]">{attachment.name}</span>
                            <button type="button" onClick={() => {setAttachment(null); fileInputRef.current.value = '';}} className="text-red-500 font-bold">&times;</button>
                        </div>
                    )}

                    <label className="p-2 text-gray-400 hover:text-orange-500 cursor-pointer transition flex items-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileSelect}
                            ref={fileInputRef}
                        />
                    </label>

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-gray-700 placeholder-gray-400 outline-none"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim() && !attachment}
                      className={`p-2 rounded-xl transition-all ${
                        newMessage.trim() || attachment
                          ? 'bg-black text-white hover:bg-gray-800 shadow-md' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full rounded-lg shadow-2xl" />
          <button className="absolute top-4 right-4 text-white text-4xl">&times;</button>
        </div>
      )}
    </div>
  );
}