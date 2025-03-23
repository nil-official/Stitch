import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Truck, Package, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext'
import BASE_URL from '../utils/baseurl';
import { ThreeDots } from 'react-loader-spinner';

const OrderSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderDetails = location.state;

    const { currency, cartIds, setRerender, rerender } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const orderId = orderDetails.id;

    useEffect(() => {
        if (orderDetails == null) {
            navigate('/cart');
        }
    }, [navigate])

    const deleteCartItems = () => {
        console.log(cartIds);
        cartIds.map(async (orderId) => {
            try {
                console.log(orderId);
                const res = await axios.delete(`${BASE_URL}/api/cart_items/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                    }
                })
                if (res) {
                    console.log(res);
                    setRerender(!rerender);
                }
            } catch (err) {
                console.log("Something went wrong", err)
            }
        })
    }

    const paymentHandler = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/payments/${orderId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            if (res) {
                console.log(res.data);
                deleteCartItems();
                window.open(`${res.data.payment_link_url}`, "_blank");
            }
        } catch (err) {
            console.log("Something went wrong", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center'>
            <div className='w-[1400px] flex flex-col justify-center p-6'>
                {orderDetails &&
                    // <OrderDetails orderData={orderDetails} />
                    <div className="p-6 shadow-md rounded-md">
                        {/* Order Header */}
                        <div className="flex justify-between items-center mb-8 pb-4 border-b">
                            <h1 className="text-xl font-bold text-gray-800">Order Summary</h1>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-600">Order ID: {orderDetails.orderId}</p>
                                <p className="text-sm font-bold text-gray-600">Placing on: {format(new Date(orderDetails.orderDate), 'dd MMM yyyy')}</p>
                            </div>
                        </div>
                        {/* Order Status */}
                        <div className="mb-8 bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Truck className="text-blue-600" size={24} />
                                <div>
                                    <p className="font-semibold text-blue-800">Estimated Delivery</p>
                                    <p className="text-blue-600">{format(new Date(orderDetails.deliveryDate), 'dd MMM yyyy')}</p>
                                </div>
                                {/*  */}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderDetails.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                orderDetails.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {orderDetails.orderStatus}
                            </span>
                        </div>

                        {/* Delivery Address */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Package className="mr-2" size={20} /> Delivery Address
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                                <p className="font-medium">{orderDetails.orderAddress.firstName} {orderDetails.orderAddress.lastName}</p>
                                <p>{orderDetails.orderAddress.streetAddress}</p>
                                <p>{orderDetails.orderAddress.city}, {orderDetails.orderAddress.state} {orderDetails.orderAddress.zipCode}</p>
                                <p className="">Phone: {orderDetails.orderAddress.mobile}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Calendar className="mr-2" size={20} /> Order Items
                            </h2>
                            <div className="space-y-4">
                                {orderDetails.orderItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="w-24 flex-shrink-0">
                                            <img
                                                src={item.product.preview}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg">{item.product.title}</h3>
                                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                <p>Size: {item.size[0] === 'T' ? item.size.split('T')[1] : item.size}</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="font-medium text-black text-lg">{currency}&nbsp;{item.discountedPrice}</span>
                                                    {item.price !== item.discountedPrice && (
                                                        <>
                                                            <span className="line-through text-gray-500">{currency}&nbsp;{item.price}</span>
                                                            <span className="text-green-600 font-medium">
                                                                ({Math.round((item.price - item.discountedPrice) / item.price * 100)}% OFF)
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <CreditCard className="mr-2" size={20} /> Order Summary
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Items Total</span>
                                        <span>{currency}&nbsp;{orderDetails.totalPrice}.00</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>- {currency}&nbsp;{orderDetails.totalPrice - orderDetails.totalDiscountedPrice}.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                        <span>Total Amount</span>
                                        <span>{currency}&nbsp;{orderDetails.totalDiscountedPrice}.00</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <div className='text-end'>
                                    <button
                                        onClick={paymentHandler}
                                        disabled={loading}  // Disable the button while loading
                                        className="min-w-28 bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 flex justify-center">
                                        {loading ? (
                                            <ThreeDots
                                                height="24"
                                                width="24"
                                                color="white"
                                                ariaLabel="loading"
                                            />
                                        ) : (
                                            "Pay Now"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default OrderSummary
