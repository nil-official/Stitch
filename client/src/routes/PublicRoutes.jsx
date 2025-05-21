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
            <Route path="/auth/login" element={<LoginForm />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
        </Routes>
    );
};

export default PublicRoutes;