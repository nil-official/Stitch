import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import decodeJWT from '../utils/decodeJWT'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';

const AdminOrders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = "http://localhost:5454/api/admin/orders/";

    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
            if (authorities.includes("ROLE_ADMIN")) {
                navigate('/admin/orders');
            } else {
                navigate('/login');
            }
        } else 
            navigate('/login');
    }, [navigate])

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })

            if (response.data) {
                console.log(response.data)
                setOrders(response.data);
            } else {
                console.error('Unexpected response format:', response.data)
                toast.error('Error fetching orders. Please try again.')
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast.error('Error fetching orders. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const deleteOrder = async (id) => {
        setOrders(orders.filter(order => order.id !== id));
        console.log(id)
        // send delete request to API
        axios.delete(`http://localhost:5454/api/admin/orders/${id}/delete`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        })
        .then(response => {
            console.log(response)
            toast.success('Order deleted successfully.')
        })
        .catch(error => {
            console.error('Error deleting order:', error)
            toast.error('Error deleting order. Please try again.')
        }
        )
    }

    

    return (
        <>
            <div className="mx-12 sm:mx-24 md:mx-40 lg:mx-48 xl:mx-80">
                <div className="space-y-12">
                <div></div>
                <div className="pb-4">
                <h2 className="text-4xl font-semibold text-gray-900">All Orders</h2>
                <p className="mt-1 text-sm/6 text-gray-600">Edit or delete orders from the buttons</p>
                </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Order ID</th>
                                    {/* <th scope="col" className="px-6 py-3">Product</th> */}
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((ord, index) => (
                                    <OrderCard key={index} order={ord} deleteOrder={deleteOrder} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminOrders