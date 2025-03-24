import { Route, Routes } from 'react-router-dom';
import AdminHelpSupport from '../pages/AdminHelpSupport';
import AdminProducts from '../pages/AdminProducts';
import CreateProduct from '../pages/CreateProduct';
import EditProduct from '../pages/EditProduct';
import AdminOrders from '../pages/AdminOrders';
import AdminUsers from '../pages/AdminUsers';
import EditUser from '../pages/EditUser';
import Error404 from '../pages/Error404';

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
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
};

export default AdminRoutes;