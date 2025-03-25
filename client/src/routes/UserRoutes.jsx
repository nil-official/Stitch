import { useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import VerifyEmail from '../pages/VerifyEmail';
import MaintenancePage from '../pages/MaintenancePage';
import Home from '../pages/Home';
import ProductPage from '../pages/ProductPage';
import Wishlist from '../pages/Wishlist';
import Orders from '../pages/Orders';
import UserProfile from '../pages/UserProfile';
import OrdersDetails from '../pages/OrderDetails';
import HelpAndSupport from '../pages/HelpAndSupport';
import OrderAddress from '../pages/OrderAddress';
import OrderSummary from '../pages/OrderSummary';
import Cart from '../pages/Cart';
import SearchPage from '../pages/SearchPage';
import Error404 from '../pages/Error404';

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
                <Route path="/" element={<Home isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />} />
                <Route path="/products/search" element={<SearchPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/order-summary" element={<OrderSummary />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrdersDetails />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/order-address" element={<OrderAddress />} />
                <Route path="/help" element={<HelpAndSupport />} />
                <Route path="*" element={<Error404 />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;