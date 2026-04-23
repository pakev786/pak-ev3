import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = ({ active }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStr = localStorage.getItem('adminUser');
    if (adminStr) {
      setAdmin(JSON.parse(adminStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const allLinks = [
    { name: 'home', label: 'Home', path: '/adminHome', perm: 'any' },
    { name: 'stats', label: 'Stats', path: '/adminStats', perm: 'stats' },
    { name: 'categories', label: 'Categories', path: '/adminCategories', perm: 'categories' },
    { name: 'products', label: 'Products', path: '/adminProducts', perm: 'products' },
    { name: 'orders', label: 'Orders', path: '/adminOrders', perm: 'orders' },
    { name: 'accounts', label: 'Accounts', path: '/adminAccounts', perm: 'accounts' },
    { name: 'support', label: 'Support', path: '/adminSupport', perm: 'support' },
    { name: 'vouchers', label: 'Vouchers', path: '/adminVouchers', perm: 'vouchers' },
    { name: 'branches', label: 'Branches', path: '/adminBranches', perm: 'branches' }, // <--- NEW LINK ADDED
    { name: 'admins', label: 'Admins', path: '/adminManagement', perm: 'superadmin_only' },
    { name: 'evConfig', label: 'EV Config', path: '/adminEVConfig', perm: 'config' },
    { name: 'showProducts', label: 'Show Products', path: '/showProducts', perm: 'showProducts' } 
  ];

  // Filter links based on role/permissions
  const allowedLinks = allLinks.filter(link => {
    if (!admin) return false;
    if (admin.role === 'superadmin') return true;
    if (link.perm === 'superadmin_only') return false;
    if (link.perm === 'any') return true;
    return admin.permissions.includes(link.perm);
  });

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/adminHome" className="flex items-center space-x-3 flex-shrink-0">
            <img src="/logo.png" alt="Admin Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" onError={(e) => e.target.style.display = 'none'} />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold text-orange-500 whitespace-nowrap">Pak EV</h1>
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                {admin?.role === 'superadmin' ? 'Super Admin' : 'Admin Panel'}
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
             <span className="text-sm font-bold text-gray-300 mr-2">{admin?.username}</span>
             <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg text-sm font-bold transition">Logout</button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-full hover:bg-orange-500 transition-all duration-300">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div className="hidden md:block bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto w-full">
            {allowedLinks.map((link, index) => {
              const isSelected = active === link.name;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-all duration-300 border-r border-gray-200 last:border-r-0 flex-1 text-center ${isSelected ? 'bg-orange-500 text-white' : 'text-black hover:bg-orange-100'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-black border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {allowedLinks.map((link, index) => (
              <Link key={index} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 font-medium transition-all duration-300 rounded-lg ${active === link.name ? 'bg-orange-500 text-white' : 'text-black hover:bg-orange-100'}`}>
                {link.label}
              </Link>
            ))}
            <button onClick={handleLogout} className="block w-full text-left px-4 py-3 font-bold text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;