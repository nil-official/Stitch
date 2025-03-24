import { Route, Routes } from 'react-router-dom';
import LoginForm from '../pages/LoginForm';
import RegisterPage from '../pages/RegisterPage';
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

const UserRoutes = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {
    return (
        <Routes>
            <Route path="/maintainance" element={<MaintenancePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
                path="/"
                element={
                    <Home isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />
                }
            />
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
        </Routes>
    );
};

export default UserRoutes;