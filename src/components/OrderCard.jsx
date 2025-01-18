import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderCard = ({ order, deleteOrder }) => {

	const [status, setStatus] = useState(order.orderStatus.toLowerCase());
	console.log(status)

	const changeStatus = async (e) => {
		if(e.target.value === "STATUS") return;
		try {

			const response = await axios.put(`http://localhost:5454/api/admin/orders/${order.id}/${e.target.value}`, {}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
				}
			});
			if (response.data) {
				setStatus(response.data.orderStatus);
				console.log("status updated: ", response.data)
				toast.success('Order status updated successfully.');
			} else {
				console.error('Unexpected response format:', response.data);
				toast.error('Error updating order status. Please try again.');
			}
		} catch (error) {
			console.error('Error updating order status:', error);
			toast.error('Error updating order status. Please try again.');
		}
	}

	return (
		<tr key={order.id} className="odd:bg-white even:bg-gray-50 border-b">
			<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
				{order.orderId}
			</th>
			<td className="px-6 py-4">{status.toUpperCase()}</td>
			<td className="px-6 py-4 flex space-x-2">
				<div className="relative">
					<select
						onChange={(e) => changeStatus(e)}
						className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="STATUS">--STATUS--</option>
						<option value="confirmed">CONFIRMED</option>
						<option value="ship">SHIPPED</option>
						<option value="deliver">DELIVERED</option>
						<option value="cancel">CANCELLED</option>
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
						<svg
							className="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M5.5 8.5L10 13l4.5-4.5h-9z" />
						</svg>
					</div>
				</div>
				<button
					onClick={() => deleteOrder(order.id)}
					className="font-medium text-red-600 hover:underline"
				>
					Delete
				</button>
			</td>
		</tr>

	)
}

export default OrderCard