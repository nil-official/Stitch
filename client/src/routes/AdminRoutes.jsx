import { Route, Routes } from 'react-router-dom';
import AdminHelpSupport from '../pages/admin/AdminHelpSupport';
import AdminProducts from '../pages/admin/AdminProducts';
import CreateProduct from '../pages/admin/CreateProduct';
import EditProduct from '../pages/admin/EditProduct';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import EditUser from '../pages/admin/EditUser';
import ErrorPage from '../pages/ErrorPage';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/products/edit" element={<EditProduct />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/users/edit" element={<EditUser />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/help" element={<AdminHelpSupport />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};

export default AdminRoutes;