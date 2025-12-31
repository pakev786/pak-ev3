import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminStats() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // 'week', 'month', 'year', 'all'
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';;
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

    return { totalRevenue, totalQuantity, pieData };
  };

  const { totalRevenue, totalQuantity, pieData } = getStats();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <AdminNavbar active="stats" />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sales Statistics</h1>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 mt-4 md:mt-0">
            {['week', 'month', 'year', 'all'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  filter === f ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                This {f === 'all' ? 'Time' : f}
              </button>
            ))}
          </div>
        </div>

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

            {/* Top Products List */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Best Sellers Breakdown</h3>
              <div className="space-y-4">
                {pieData.length > 0 ? (
                    pieData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-400 w-4">{index + 1}.</span>
                            <span className="font-medium text-gray-800 line-clamp-1">{item.name}</span>
                        </div>
                        <span className="font-bold bg-gray-100 px-3 py-1 rounded-lg text-sm">{item.value} Sold</span>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center">No data available.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}