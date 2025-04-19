import { useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import Login from '../components/Auth/Login';
import HomePage from '../pages/user/HomePage';
import CartPage from '../pages/user/CartPage';
import HelpPage from '../pages/user/HelpPage';
import OrderSummary from '../pages/OrderSummary';
import OrderAddress from '../pages/OrderAddress';
import SearchPage from '../pages/user/SearchPage';
import OrdersPage from '../pages/user/OrdersPage';
import Register from '../components/Auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ProductPage from '../pages/user/ProductPage';
import ProfilePage from '../pages/user/ProfilePage';
import WishlistPage from '../pages/user/WishlistPage';
import MaintenancePage from '../pages/MaintenancePage';
import ResetPassword from '../pages/auth/ResetPassword';
import MainLayout from '../components/Layout/MainLayout';
import ForgotPassword from '../pages/auth/ForgotPassword';
import OrdersDetailsPage from '../pages/user/OrderDetailsPage';
import ShippingPage from '../pages/user/ShippingPage';

const UserRoutes = () => {

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef(null);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/maintainance" element={<MaintenancePage />} />
            <Route element={<MainLayout isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />}>
                <Route path="/" element={<HomePage isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />} />
                {/* User */}
                <Route path="/user/cart" element={<CartPage />} />
                <Route path="/user/account" element={<ProfilePage />} />
                <Route path="/user/wishlist" element={<WishlistPage />} />
                <Route path="/user/orders" element={<OrdersPage />} />
                <Route path="/user/orders/:id" element={<OrdersDetailsPage />} />
                {/* Checkout */}
                {/* <Route path="/checkout/init" element={<OrderAddress />} /> */}
                <Route path="/checkout/shipping" element={<ShippingPage />} />
                <Route path="/checkout/summary" element={<OrderSummary />} />
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