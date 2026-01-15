import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminStats() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // 'week', 'month', 'year', 'all', 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Detail View State
  const [selectedProduct, setSelectedProduct] = useState(null); // Name of product for detail view
  const [productDetails, setProductDetails] = useState([]);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orders`);
      // Only consider Verified or Delivered orders for valid sales stats
      const validOrders = response.data.filter(o => 
        o.status === 'Verified' || o.status === 'Delivered'
      );
      setOrders(validOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (orders, filterType) => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (filterType === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return orderDate >= oneWeekAgo;
      }
      if (filterType === 'month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      if (filterType === 'year') {
        return orderDate.getFullYear() === now.getFullYear();
      }
      if (filterType === 'custom') {
        if (!startDate || !endDate) {
          return true; // Show all if dates not set
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include full end day
        return orderDate >= start && orderDate <= end;
      }
      return true; // 'all'
    });
  };

  const getStats = () => {
    const filteredOrders = filterOrders(orders, filter);
    
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalCost, 0);
    
    let totalQuantity = 0;
    const categorySales = {};

    filteredOrders.forEach(order => {
      order.products.forEach(item => {
        totalQuantity += item.quantity;
        if (categorySales[item.title]) {
            categorySales[item.title] += item.quantity;
        } else {
            categorySales[item.title] = item.quantity;
        }
      });
    });

    // Prepare data for Pie Chart (Top 5 products)
    const pieData = Object.keys(categorySales).map(key => ({
      name: key,
      value: categorySales[key]
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    return { totalRevenue, totalQuantity, pieData, filteredOrders };
  };

  const handleProductClick = (productName, filteredOrders) => {
      // Find all orders containing this product
      const details = [];
      filteredOrders.forEach(order => {
          const item = order.products.find(p => p.title === productName);
          if (item) {
              details.push({
                  orderId: order.id,
                  customerName: order.user?.name || 'Unknown',
                  date: order.createdAt,
                  quantity: item.quantity,
                  price: item.price
              });
          }
      });
      // Sort by date desc
      details.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setProductDetails(details);
      setSelectedProduct(productName);
  };

  const handleExport = () => {
    const { filteredOrders } = getStats();
    
    // Flatten data for CSV
    const rows = [['Order ID', 'Date', 'Customer', 'Product', 'Quantity', 'Price', 'Total', 'Status']];
    
    filteredOrders.forEach(order => {
        order.products.forEach(item => {
            rows.push([
                order.id,
                new Date(order.createdAt).toLocaleDateString(),
                order.user?.name || 'Unknown',
                item.title,
                item.quantity,
                item.price,
                item.quantity * item.price,
                order.status
            ]);
        });
    });

    let csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { totalRevenue, totalQuantity, pieData, filteredOrders } = getStats();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <AdminNavbar active="stats" />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sales Statistics</h1>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <button 
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export Excel
             </button>

             <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                {['week', 'month', 'year', 'all', 'custom'].map((f) => (
                <button
                    key={f}
                    onClick={() => { setFilter(f); setSelectedProduct(null); }} // Reset detail view on filter change
                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                    filter === f ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {f === 'all' ? 'All Time' : f}
                </button>
                ))}
             </div>
          </div>
        </div>

        {filter === 'custom' && (
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-md mx-auto">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-500 mb-1">Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-white p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-500 mb-1">End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-white p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>
          </div>
        )}

        {loading ? (
           <div className="h-96 flex items-center justify-center">Loading stats...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Stats Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl font-bold">
                  ₨
                </div>
                <div>
                  <p className="text-gray-500 font-bold uppercase text-sm">Total Revenue</p>
                  <h2 className="text-4xl font-bold text-gray-900">
                    {totalRevenue.toLocaleString()}
                  </h2>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold">
                  📦
                </div>
                <div>
                  <p className="text-gray-500 font-bold uppercase text-sm">Products Sold</p>
                  <h2 className="text-4xl font-bold text-gray-900">
                    {totalQuantity.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>

            {/* Pie Chart Section */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[500px]">
              <h3 className="text-xl font-bold mb-6">Top Selling Products</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No sales data for this period.</div>
              )}
            </div>

            {/* Top Products List / Details View */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
              
              {!selectedProduct ? (
                // VIEW 1: PRODUCT LIST
                <>
                    <h3 className="text-xl font-bold mb-6">Best Sellers Breakdown</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {pieData.length > 0 ? (
                            pieData.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleProductClick(item.name, filteredOrders)}
                                className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-400 w-4 group-hover:text-orange-500 transition">{index + 1}.</span>
                                    <span className="font-medium text-gray-800 line-clamp-1 group-hover:text-orange-600 transition">{item.name}</span>
                                </div>
                                <span className="font-bold bg-gray-100 px-3 py-1 rounded-lg text-sm group-hover:bg-orange-100 group-hover:text-orange-600 transition">{item.value} Sold</span>
                            </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No data available.</p>
                        )}
                    </div>
                </>
              ) : (
                // VIEW 2: PRODUCT DETAIL (Drill Down)
                <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <button 
                            onClick={() => setSelectedProduct(null)} 
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </button>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-none">{selectedProduct}</h3>
                            <span className="text-xs text-gray-500">Sales History</span>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {productDetails.map((detail, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm text-gray-800">{detail.customerName}</span>
                                    <span className="text-xs text-gray-400">{new Date(detail.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="bg-white px-2 py-1 rounded border border-gray-200">Qty: <strong>{detail.quantity}</strong></span>
                                    <span className="font-mono text-gray-600">Total: ₨ {(detail.price * detail.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}