import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotalValue from '../components/CartTotalValue';
import axios from '../utils/axiosConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import TotalOrderComponent from '../components/TotalOrderComponent';
import BASE_URL from '../utils/baseurl';
import { format } from 'date-fns';

const Orders = () => {
    const location = useLocation();
    const userDetails = location.state;
    const navigate = useNavigate();
    const { currency } = useContext(ShopContext);
    const [totalOrderData, setTotalOrderData] = useState([]);
    const [totalCartData, setTotalCartData] = useState([]);
    const [subtotal, setSubtotal] = useState(0)
    const [render, setRender] = useState(1);

    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                const res = await axios.get('/api/orders/user');
                if (res) {
                    setTotalOrderData(res.data);
                }
            } catch (err) {
                console.log("Something went wrong", err)
            }
        }
        fetchOrdersData()
    }, [])

    // const deleteCartItem = async (id) => {
    //     try{
    //         const res = await axios.delete(`${BASE_URL}/api/cart_items/${id}`,{
    //             headers: { 
    //                 Authorization: `Bearer ${localStorage.getItem("jwtToken")}` 
    //               }
    //         })
    //         if(res){
    //             console.log(res);
    //             setRender(!render);
    //         }

    //     }catch(err){
    //         console.log("Something went wrong",err)
    //     }
    // }

    // const updateCartItem = async (id, cart, product, size, quantity, price, userId) => {
    //     console.log(quantity);
    //     try {
    //         const res = await axios.put(`${BASE_URL}/api/cart_items/${id}`, {
    //             cart, product, size, quantity, price, userId 
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("jwtToken")}` 
    //             }
    //         });
    //         if(res){
    //             console.log(res)
    //             setRender(!render);
    //         }
    //     }catch(err){
    //         console.log("Something went wrong",err)
    //     }
    // }

    return (
        <div className='min-h-[80vh] flex justify-center'>
            <div className='w-[1400px] p-6'>
                <p className='text-2xl font-bold mb-4'>My Orders</p>
                {/* details of cartItems */}
                <div className='space-y-4'>
                    {totalOrderData
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((item, id) => (
                            <div key={id} className='p-6 shadow-md rounded-md'>
                                <div className='flex justify-between'>
                                    <div className='font-medium'>
                                        <p>Order Id: {item.orderId}</p>
                                        <p>Order Date: {format(new Date(item.createdAt), 'MMMM dd, yyyy')}</p>
                                    </div>
                                    <div
                                        className={`max-h-10 px-4 rounded-full text-sm font-medium flex justify-center items-center
                                            ${item.orderStatus === 'PENDING' ? 'bg-red-100 text-red-800' :
                                                item.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                        {item.orderStatus}
                                    </div>
                                </div>
                                <div className=''>
                                    {item.orderItems.map((orderItem, index) => (
                                        <TotalOrderComponent
                                            key={index}
                                            orderData={orderItem}
                                            totalDetails={item}
                                        />
                                    ))}
                                </div>
                                <div className='flex justify-end'>
                                    <button
                                        onClick={() => navigate(`/orders/${item.orderId}`)}
                                        className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700"
                                    >
                                        View Order
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Orders