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
import ConfirmationPage from './pages/ConfirmationPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import HelpAndSupport from './pages/HelpAndSupport'
import Error404 from './pages/Error404';
import OrderAddress from './pages/OrderAddress';
import OrderSummary from './pages/OrderSummary';
import Cart from './pages/Cart';
import AuthGuard from './utils/AuthGuard';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthGuard>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search/:name" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrdersDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/order-address" element={<OrderAddress />} />
          {/* <Route path="/payment/:id" element={<ConfirmationPage />} /> */}
          <Route path="/help" element={<HelpAndSupport />} />
          <Route path="*" element={<Error404 />} />
        </Route>

        {/* Admin routes */}
        {/* <Route path='/admin/dashboard' element={<AdminDashboard />} /> */}

        {/* Error route */}

      </Routes>
    </AuthGuard>
  );
}

export default App;
