import { Route, Routes } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import Login from '../components/Auth/Login';
import HomePage from '../pages/user/HomePage';
import CartPage from '../pages/user/CartPage';
import HelpPage from '../pages/user/HelpPage';
import SearchPage from '../pages/user/SearchPage';
import OrdersPage from '../pages/user/OrdersPage';
import Register from '../components/Auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ProductPage from '../pages/user/ProductPage';
import ProfilePage from '../pages/user/ProfilePage';
import SummaryPage from '../pages/user/SummaryPage';
import PaymentPage from '../pages/user/PaymentPage';
import WishlistPage from '../pages/user/WishlistPage';
import ShippingPage from '../pages/user/ShippingPage';
import MaintenancePage from '../pages/MaintenancePage';
import ResetPassword from '../pages/auth/ResetPassword';
import MainLayout from '../components/Layout/MainLayout';
import ForgotPassword from '../pages/auth/ForgotPassword';
import OrdersDetailsPage from '../pages/user/OrderDetailsPage';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify" element={<VerifyEmail />} />
            <Route path="/maintainance" element={<MaintenancePage />} />
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                {/* User */}
                <Route path="/user/account" element={<ProfilePage />} />
                <Route path="/user/wishlist" element={<WishlistPage />} />
                <Route path="/user/orders" element={<OrdersPage />} />
                <Route path="/user/orders/:id" element={<OrdersDetailsPage />} />
                {/* Checkout */}
                <Route path="/checkout/cart" element={<CartPage />} />
                <Route path="/checkout/shipping" element={<ShippingPage />} />
                <Route path="/checkout/summary" element={<SummaryPage />} />
                <Route path="/checkout/payment" element={<PaymentPage />} />
                {/* Product */}
                <Route path="/product/:id" element={<ProductPage />} />
                {/* Others */}
                <Route path="/search" element={<SearchPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;