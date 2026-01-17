import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';
import EVCalculator from './pages/EVCalculator';
import LoadCalculator from './pages/LoadCalculator';
import CategoryProducts from './pages/CategoryProducts';
import SectionProducts from './pages/SectionProducts';
import ProductDisplay from './pages/ProductDisplay';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SearchPage from './pages/SearchPage';
import BranchesPage from './pages/BranchesPage';
import AboutUs from './pages/AboutUs';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import { CartProvider } from './context/CartContext';

// Admin Imports
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';
import AdminCategories from './pages/AdminCategories';
import AdminProducts from './pages/AdminProducts';
import AdminAccounts from './pages/AdminAccounts';
import AdminOrders from './pages/AdminOrders';
import AdminSupport from './pages/AdminSupport';
import AdminVouchers from './pages/AdminVouchers';
import AdminStats from './pages/AdminStats';
import AdminManagement from './pages/AdminManagement';
import AdminRoute from './components/AdminRoute';
import AdminEVConfiguration from './pages/AdminEVConfiguration';

export default function App() {
  const GOOGLE_CLIENT_ID = "386543108130-44n5t7m2j3pq0u4kjd0bcsd782eed7a1.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CartProvider>
        <Router>
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/ev-calculator" element={<EVCalculator />} />
            <Route path="/load-calculator" element={<LoadCalculator />} />
            <Route path="/category/:categorySlug" element={<CategoryProducts />} />
            <Route path="/section/:sectionSlug" element={<SectionProducts />} />
            <Route path="/product/:id" element={<ProductDisplay />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            
            <Route path="/adminHome" element={
              <AdminRoute><AdminHome /></AdminRoute>
            } />
            
            <Route path="/adminStats" element={
              <AdminRoute requiredPermission="stats"><AdminStats /></AdminRoute>
            } />
            
            <Route path="/adminCategories" element={
              <AdminRoute requiredPermission="categories"><AdminCategories /></AdminRoute>
            } />
            
            <Route path="/adminProducts" element={
              <AdminRoute requiredPermission="products"><AdminProducts /></AdminRoute>
            } />
            
            <Route path="/adminEVConfig" element={
              <AdminRoute requiredPermission="config"><AdminEVConfiguration /></AdminRoute>
            } />

            <Route path="/adminOrders" element={
              <AdminRoute requiredPermission="orders"><AdminOrders /></AdminRoute>
            } />
            
            <Route path="/adminAccounts" element={
              <AdminRoute requiredPermission="accounts"><AdminAccounts /></AdminRoute>
            } />
            
            <Route path="/adminSupport" element={
              <AdminRoute requiredPermission="support"><AdminSupport /></AdminRoute>
            } />
            
            <Route path="/adminVouchers" element={
              <AdminRoute requiredPermission="vouchers"><AdminVouchers /></AdminRoute>
            } />
            <Route path="/adminManagement" element={
              <AdminRoute requiredPermission="superadmin_only"><AdminManagement /></AdminRoute>
            } />

          </Routes>
        </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}