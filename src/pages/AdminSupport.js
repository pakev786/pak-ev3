import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminSupport() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;

  useEffect(() => {
    fetchChatUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setLoadingMessages(true); // Show loading when switching users
      fetchMessages(selectedUser.id).then(() => setLoadingMessages(false));
      
      const interval = setInterval(() => fetchMessages(selectedUser.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const payload = {
        sender: "ADMIN",
        receiver: selectedUser.id,
        message: newMessage
      };
      
      const response = await axios.post(`${BASE_URL}/api/chat`, payload);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      alert('Failed to send message');
    }
  };

  // Helper to format date
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <AdminNavbar active="support" />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 py-6 h-[calc(100vh-80px)]">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Support Dashboard</h1>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-1 overflow-hidden">
          
          {/* LEFT SIDEBAR: User List */}
          <div className={`w-full md:w-80 border-r border-gray-200 bg-gray-50 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="font-bold text-lg text-gray-800">Conversations</h2>
              <span className="text-xs text-gray-500">{users.length} active chats</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingUsers ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="text-sm text-gray-400">Loading users...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p>No active conversations found.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {users.map(user => (
                    <li 
                      key={user.id} 
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 cursor-pointer transition-all hover:bg-white ${
                        selectedUser?.id === user.id 
                          ? 'bg-white border-l-4 border-l-orange-500 shadow-sm' 
                          : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                          selectedUser?.id === user.id ? 'bg-orange-500' : 'bg-gray-400'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email || user.phone}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Chat Window */}
          <div className={`flex-1 flex flex-col bg-white ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedUser(null)}
                      className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedUser.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                        Online
                      </p>
                    </div>
                  </div>
                  {/* Optional: Add user details or actions here */}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4 custom-scrollbar relative">
                   {/* Background pattern or color can go here */}
                   {loadingMessages && messages.length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                   ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                        <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>No messages yet. Say hello!</p>
                      </div>
                   ) : (
                      messages.map((msg, idx) => {
                        const isAdmin = msg.sender === 'ADMIN';
                        return (
                          <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                              <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                                isAdmin 
                                  ? 'bg-orange-500 text-white rounded-br-none' 
                                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                              }`}>
                                <p className="whitespace-pre-wrap">{msg.message}</p>
                              </div>
                              <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {formatTime(msg.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                   )}
                   <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-3 items-end bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-gray-700 placeholder-gray-400"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className={`p-2 rounded-xl transition-all ${
                        newMessage.trim() 
                          ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Customer Support</h3>
                <p className="max-w-xs text-center text-sm">Select a conversation from the sidebar to start chatting with customers.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}