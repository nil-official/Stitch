import { useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import VerifyEmail from '../pages/VerifyEmail';
import MaintenancePage from '../pages/MaintenancePage';
import HomePage from '../pages/user/HomePage';
import ProductPage from '../pages/user/ProductPage';
import Orders from '../pages/Orders';
import UserProfile from '../pages/UserProfile';
import OrdersDetails from '../pages/OrderDetails';
import HelpAndSupport from '../pages/HelpAndSupport';
import OrderAddress from '../pages/OrderAddress';
import OrderSummary from '../pages/OrderSummary';
import CartPage from '../pages/user/CartPage';
import SearchPage from '../pages/user/SearchPage';
import WishlistPage from '../pages/user/WishlistPage';
import ErrorPage from '../pages/ErrorPage';

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
                <Route path="/products/search" element={<SearchPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/order-summary" element={<OrderSummary />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrdersDetails />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/order-address" element={<OrderAddress />} />
                <Route path="/help" element={<HelpAndSupport />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;