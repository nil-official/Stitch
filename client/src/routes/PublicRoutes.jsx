import { Route, Routes } from 'react-router-dom';
import LoginForm from '../pages/LoginForm';
import RegisterPage from '../pages/RegisterPage';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import VerifyEmail from '../pages/VerifyEmail';
import MaintenancePage from '../pages/MaintenancePage';

const PublicRoutes = () => {
    console.log("Public Routes...");
    
    return (
        <Routes>
            <Route path="/maintainance" element={<MaintenancePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
    );
};

export default PublicRoutes;