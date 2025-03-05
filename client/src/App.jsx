import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home'
import LoginForm from './pages/LoginForm'
import './App.css'
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import ProductDetails from './pages/ProductDetails'
import Footer from './components/Footer'
import Wishlist from './pages/Wishlist'
import Orders from './pages/Orders';
import Search from './pages/Search'
import UserProfile from './pages/UserProfile'
import OrdersDetails from './pages/OrderDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import HelpAndSupport from './pages/HelpAndSupport'
import Error404 from './pages/Error404';
import OrderAddress from './pages/OrderAddress';
import OrderSummary from './pages/OrderSummary';
import Cart from './pages/Cart';
import AuthGuard from './utils/AuthGuard';
import AdminHelpSupport from './pages/AdminHelpSupport';
import AdminProducts from './pages/AdminProducts';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import EditUser from './pages/EditUser';
import { useRef, useState } from 'react';
import SearchPage from './pages/SearchPage';
import MaintenancePage from './pages/MaintenancePage';

function Layout({ isSearchOpen, setIsSearchOpen, searchInputRef }) {
  return (
    <>
      <Navbar
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchInputRef={searchInputRef}
      />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  return (
    <AuthGuard>
      <Routes>
        {/* Public routes */}
        <Route path="/maintainance" element={<MaintenancePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route element={<Layout isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />}>
          {/* User Routes */}
          <Route path="/" element={<Home isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />} />
          <Route path="/search/:name" element={<Search />} />
          <Route path="/product/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrdersDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/order-address" element={<OrderAddress />} />
          <Route path="/help" element={<HelpAndSupport />} />
          {/* Admin routes */}
          <Route path="/admin/products/create" element={<CreateProduct />} />
          <Route path="/admin/products/edit" element={<EditProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users/edit" element={<EditUser />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path='/admin/help' element={<AdminHelpSupport />} />
          {/* Error route */}
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </AuthGuard>
  );
}

export default App;