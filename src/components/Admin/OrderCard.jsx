import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import format from 'date-fns/format';
import BASE_URL from '../../utils/baseurl';
import { ShopContext } from '../../context/ShopContext';

const OrderCard = ({ order, deleteOrder }) => {
    const { currency } = useContext(ShopContext);
    const initialStatus = order.orderStatus;
    const [tempStatus, setTempStatus] = useState(initialStatus);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    const API_URL = `${BASE_URL}/api/admin/orders/`;

	const statusUrl = {
		'CONFIRMED': 'confirmed',
		'SHIPPED': 'ship',
		'DELIVERED': 'deliver',
		'CANCELLED': 'cancel'
	}

    const statusFlow = initialStatus === 'PENDING'
        ? ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
        : ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const handleStatusToggle = () => {
        const currentIndex = statusFlow.indexOf(tempStatus);
        const nextIndex = (currentIndex + 1) % statusFlow.length;
        const nextStatus = statusFlow[nextIndex];

        setTempStatus(nextStatus);
        setIsSaveEnabled(nextStatus !== initialStatus); // Disable save if cycled back to the initial state
    };

    const saveStatus = async () => {
        try {
            const response = await axios.put(`${API_URL}${order.id}/${statusUrl[tempStatus]}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            });

            if (response.data) {
                toast.success(`Order status updated to ${tempStatus}.`);
                setIsSaveEnabled(false); // Disable save button after successful save
            }
        } catch (error) {
            toast.error('Error updating order status. Please try again.');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md border">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Order ID: {order.orderId}</h3>
                    <p className="text-sm text-gray-700">User ID: {order.userDto.id}</p>
                </div>
                <button
                    onClick={handleStatusToggle}
                    className={`px-2 py-1 rounded-lg mt-2 mb-2 text-xs font-semibold ${
                        tempStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        tempStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        tempStatus === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                        tempStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}
                >
                    {tempStatus}
                </button>
            </div>
            <ul className="mt-4 text-sm text-gray-700 list-disc pl-5">
                {order.orderItems.map((item, idx) => (
                    <li key={idx}>{item.product.title}</li>
                ))}
            </ul>
            <div className="mt-4 text-sm text-gray-700">
                <p>Total Items: {order.totalItem}</p>
                <p>Total Price: {currency}&nbsp;{order.totalPrice.toFixed(2)}</p>
                <p>Total Discounted Price: {currency}&nbsp;{order.totalDiscountedPrice.toFixed(2)}</p>
                <p>Delivery Date: {format(new Date(order.deliveryDate), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            <div className="mt-4 flex justify-end items-center space-x-2">
				<button
					onClick={saveStatus}
					className="px-4 py-2 bg-gray-50 text-sm font-semibold shadow rounded-lg text-black-600 hover:text-black-800 hover:shadow-lg hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition"
					disabled={!isSaveEnabled}
				>
					Save
				</button>
                <button
                    onClick={() => deleteOrder(order.id)}
                    className="px-4 py-2 text-sm font-semibold shadow rounded-lg text-red-600 hover:shadow-lg hover:bg-red-600 hover:text-white transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
