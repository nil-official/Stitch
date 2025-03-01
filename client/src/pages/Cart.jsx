import React, { useContext, useEffect, useState } from 'react';
import { X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeFromCart, updateCart } from '../redux/customer/cart/cartActions';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {

    const navigate = useNavigate();
    const [currency, setCurrency] = useState('INR');

    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cartState);
    const [isCartFetched, setIsCartFetched] = useState(false);

    const { setRerender, rerender, orderData, setOrderData } = useContext(ShopContext);

    useEffect(() => {
        dispatch(getCart()).then(() => {
            setIsCartFetched(true);
        });
    }, [dispatch]);

    const handleUpdateCart = (productId, quantity) => {
        dispatch(updateCart(productId, quantity));
    };

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleNavigate = () => {
        setOrderData({
            totalPrice: cart.totalPrice,
            totalDiscountedrice: cart.totalDiscountedPrice,
            discount: cart.discount,
            totalItems: cart.totalItem
        })
        navigate('/order-address', { state: { access: true } });
    };

    return (
        <div className="min-h-[60vh] flex justify-center">
            <div className="w-[1400px]">
                {loading || !isCartFetched ? (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : !cart?.cartItems?.length ? (
                    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-center rounded-lg p-6">
                        <img
                            src="empty-trolley.jpg"
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
                            onClick={() => navigate('/')}
                            className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 mb-20"
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col sm:flex-row'>
                        <div className="w-full sm:w-3/4 p-6 space-y-4">
                            {cart?.cartItems
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
                                        <div className="flex items-center gap-4 p-2 rounded-lg">
                                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                                <button
                                                    onClick={() => handleUpdateCart(item.id, Math.max(1, item.quantity - 1))}
                                                    className="px-2 py-1 text-lg font-semibold border-r border-gray-300 hover:bg-gray-200"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.quantity}
                                                    readOnly
                                                    className="w-8 text-center border-none outline-none pointer-events-none"
                                                />
                                                <button
                                                    onClick={() => handleUpdateCart(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 text-lg font-semibold border-l border-gray-300 hover:bg-gray-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromCart(item.id)}
                                                className="text-white bg-gray-600 hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center transition duration-200"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="w-full sm:w-1/4 p-6">
                            <div className="p-4 shadow-md rounded-md">
                                <h2 className="text-xl font-bold mb-2">Price Details</h2>
                                <hr className="mb-6" />
                                <div className="text-sm text-gray-600 space-y-6">
                                    <div className="flex justify-between">
                                        <span>Price ({cart?.totalItem} {cart?.totalItem === 1 ? "item" : "items"})</span>
                                        <span>{currency}&nbsp;{cart?.totalPrice}.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span className="text-green-500">-&nbsp;{currency}&nbsp;{cart?.discount}.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Charges</span>
                                        <span className="text-green-500">FREE</span>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span>{currency}&nbsp;{cart?.totalDiscountedPrice}.00</span>
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
                )}
            </div >
        </div >
    );
};

export default Cart;