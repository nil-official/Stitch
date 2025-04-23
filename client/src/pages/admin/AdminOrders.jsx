import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import decodeJWT from '../../utils/decodeJWT';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/Admin/OrderCard';
import BASE_URL from '../../utils/baseurl';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = `${BASE_URL}/api/admin/orders/`;

    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
            if (!authorities.includes("ROLE_ADMIN")) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            });
            if (response.data) {
                setOrders(response.data);
            } else {
                toast.error('Error fetching orders. Please try again.');
            }
        } catch (error) {
            toast.error('Error fetching orders. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const deleteOrder = async (id) => {
        setOrders(orders.filter(order => order.id !== id));
        try {
            await axios.delete(`${API_URL}${id}/delete`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            });
            toast.success('Order deleted successfully.');
        } catch (error) {
            toast.error('Error deleting order. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
                <p className="text-gray-600 mt-1">Click the status to change it, and save to persist changes.</p>
            </div>
            {isLoading ? (
                <p>Loading orders...</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} deleteOrder={deleteOrder} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
