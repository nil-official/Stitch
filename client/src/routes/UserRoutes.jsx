import { useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Orders from '../pages/Orders';
import Layout from '../components/Layout';
import ErrorPage from '../pages/ErrorPage';
import Login from '../components/Auth/Login';
import HomePage from '../pages/user/HomePage';
import CartPage from '../pages/user/CartPage';
import VerifyEmail from '../pages/VerifyEmail';
import OrderSummary from '../pages/OrderSummary';
import OrderAddress from '../pages/OrderAddress';
import OrdersDetails from '../pages/OrderDetails';
import SearchPage from '../pages/user/SearchPage';
import Register from '../components/Auth/Register';
import ResetPassword from '../pages/ResetPassword';
import ProductPage from '../pages/user/ProductPage';
import ProfilePage from '../pages/user/ProfilePage';
import HelpAndSupport from '../pages/HelpAndSupport';
import ForgotPassword from '../pages/ForgotPassword';
import WishlistPage from '../pages/user/WishlistPage';
import MaintenancePage from '../pages/MaintenancePage';

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
            <Route element={<Layout isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />}>
                <Route path="/" element={<HomePage isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />} />
                {/* User */}
                <Route path="/user/cart" element={<CartPage />} />
                <Route path="/user/account" element={<ProfilePage />} />
                <Route path="/user/wishlist" element={<WishlistPage />} />
                <Route path="/user/orders" element={<Orders />} />
                <Route path="/user/orders/:id" element={<OrdersDetails />} />
                {/* Checkout */}
                <Route path="/checkout/init" element={<OrderAddress />} />
                <Route path="/checkout/pay" element={<OrderSummary />} />
                {/* Product */}
                <Route path="/product/:id" element={<ProductPage />} />
                {/* Others */}
                <Route path="/search" element={<SearchPage />} />
                <Route path="/help" element={<HelpAndSupport />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;