import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../utils/baseurl';
import CartTotalValue from '../components/CartTotalValue';

const Cart = () => {
    const navigate = useNavigate();
    const { currency, setRerender, rerender, orderData, setOrderData } = useContext(ShopContext);
    const [data, setData] = useState(null);
    const [cartData, setCartData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDiscountedrice, setTotalDiscountedrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [render, setRender] = useState(1);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/cart/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
                });
                setCartData(res.data.cartItems);
                setTotalPrice(res.data.totalPrice);
                setTotalDiscountedrice(res.data.totalDiscountedPrice);
                setDiscount(res.data.discount);
                setTotalItems(res.data.totalItem);
            } catch (err) {
                console.error("Error fetching cart data", err);
            }
        };
        fetchCartData();
    }, [render]);

    const deleteCartItem = async (id) => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/cart_items/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
            });
            toast.success(res.data.message);
            setRender(!render);
            setRerender(!rerender);
        } catch (err) {
            console.error("Error deleting cart item", err);
        }
    };

    const updateCartItem = async (id, quantity) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/cart_items/${id}`, { quantity }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
            });
            setRender(!render);
        } catch (err) {
            console.error("Error updating cart item", err);
        }
    };

    const handleNavigate = () => {
        setOrderData({
            totalPrice, totalDiscountedrice, discount, totalItems
        })
        navigate('/order-address', { state: { access: true } });
    };

    return (
        <div className="min-h-[60vh] flex justify-center">
            <div className="w-[1400px]">

                {cartData.length > 0 ? (
                    // {/* Cart Items */}
                    <div className='flex flex-col sm:flex-row'>
                        <div className="w-full sm:w-3/4 p-6 space-y-4">
                            {cartData
                                .sort((a, b) => a.product.title.localeCompare(b.product.title))
                                .map((item, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-4 shadow-md rounded-md">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.title}
                                                className="w-36 object-cover cursor-pointer"
                                                onClick={() => navigate(`/product/${item.product.id}`)}
                                            />
                                            <div>
                                                <h2 className="text-lg font-medium">{item.product.title}</h2>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Size: {item.size[0] === 'T' ? item.size.split('T')[1] : item.size}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm mt-2">
                                                    <span className="text-lg">{currency}&nbsp;{item.product.discountedPrice}</span>
                                                    <span className="line-through text-gray-400">{currency}&nbsp;{item.product.price}</span>
                                                    <span className="text-green-500">({item.product.discountPercent}% OFF)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                min="1"
                                                defaultValue={item.quantity}
                                                onChange={(e) => updateCartItem(item.id, e.target.value)}
                                                className="w-12 border rounded-md text-center"
                                            />
                                            <button onClick={() => deleteCartItem(item.id)} >
                                                <RiDeleteBin6Line size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Price Summary */}
                        <div className="w-full sm:w-1/4 p-6">
                            <div className="p-4 shadow-md rounded-md">
                                <h2 className="text-xl font-bold mb-2">Price Details</h2>
                                <hr className="mb-6" />
                                <div className="text-sm text-gray-600 space-y-6">
                                    <div className="flex justify-between">
                                        <span>Price ({totalItems} items)</span>
                                        <span>{currency}&nbsp;{totalPrice}.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span className="text-green-500">-&nbsp;{currency}&nbsp;{discount}.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Charges</span>
                                        <span className="text-green-500">FREE</span>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span>{currency}&nbsp;{totalDiscountedrice}.00</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleNavigate}
                                    className="w-full bg-gray-800 text-white py-2 mt-6 rounded-md hover:bg-gray-700">
                                    PLACE ORDER
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-center rounded-lg p-6">
                        <img
                            src="/empty-trolley.jpg" // Replace with an empty cart image or icon
                            alt="Empty Cart"
                            className="w-52 h-52 object-contain"
                        />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Your Cart is Empty!
                        </h2>
                        <p className="text-gray-500 mb-10">
                            Looks like you haven’t added anything to your cart yet. Explore our collection and add your favorite items!
                        </p>
                        <button
                            onClick={() => navigate('/')} // Ensure the route to your home page is correct
                            className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 mb-20"
                        >
                            Shop Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart
