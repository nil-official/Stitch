import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout';
import AdminDashboard from '../pages/admin/v2/AdminDashboard';
import AdminCreateProduct from '../pages/admin/v2/AdminCreateProduct';
import AdminViewProducts from '../pages/admin/v2/AdminViewProducts';
import AdminHelpAndSupport from '../pages/admin/v2/AdminHelpAndSupport';
import AdminEditProduct from '../pages/admin/v2/AdminEditProduct';
import AdminViewAllUsers from '../pages/admin/v2/AdminViewAllUsers';
import AdminViewAllOrders from '../pages/admin/v2/AdminViewAllOrders';
import AdminEditUser from '../pages/admin/v2/AdminEditUser';
import AdminViewUserDetails from '../pages/admin/v2/AdminViewUserDetails';
import ErrorPage from '../pages/ErrorPage';

const AdminRoutesV2 = () => {
    return (
        <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route element={<AdminLayout />}>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<AdminViewProducts />} />
                <Route path="/products/create" element={<AdminCreateProduct />} />
                <Route path="/products/edit" element={<AdminEditProduct />} />
                <Route path="/help" element={<AdminHelpAndSupport />} />
                <Route path="/orders" element={<AdminViewAllOrders />} />
                <Route path="/users" element={<AdminViewAllUsers />} />
                <Route path="/users/edit" element={<AdminEditUser />} />
                <Route path="/usersDetails" element={<AdminViewUserDetails />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutesV2;