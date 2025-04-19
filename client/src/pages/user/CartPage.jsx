import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { PlusIcon, MinusIcon, TrashIcon, ShieldCheck } from 'lucide-react';
import EmptyPage from '../EmptyPage';
import Loader from '../../components/Loader';
import ErrorPage from '../ErrorPage';
import SizeDropdown from '../../components/Cart/SizeDropdown';
import Confirmation from '../../components/Confirmation';
import { addToWishlist } from '../../redux/customer/wishlist/action';
import { getCart, updateCart, removeFromCart, clearCart } from '../../redux/customer/cart/action';

const CartPage = () => {

    const dispatch = useDispatch();
    const [currency, setCurrency] = useState('INR');
    const [itemToRemove, setItemToRemove] = useState(null);
    const [removeConfirmation, setRemoveConfirmation] = useState(false);
    const [itemToMove, setItemToMove] = useState(null);
    const [moveConfirmation, setMoveConfirmation] = useState(false);
    const [clearConfirmation, setClearConfirmation] = useState(false);
    const { cart, loading, error } = useSelector((state) => state.cart);

    useEffect(() => {
        if (!cart) dispatch(getCart());
    }, [dispatch, cart]);

    const handleQuantityChange = (cartItemId, quantity, currentQuantity) => {
        if (quantity > 5) return;
        if (quantity === 0) {
            handleRemoveItem(cartItemId);
            return;
        }
        if (quantity !== currentQuantity) dispatch(updateCart(cartItemId, { quantity }));
    };

    const handleSizeChange = (cartItemId, newSize, currentSize) => {
        if (newSize !== currentSize) dispatch(updateCart(cartItemId, { size: newSize }));
    };

    const handleRemoveItem = (cartItemId) => {
        setRemoveConfirmation(true);
        setItemToRemove(cartItemId);
    };

    const handleRemoveConfirmation = () => {
        if (itemToRemove) {
            dispatch(removeFromCart(itemToRemove));
            setItemToRemove(null);
            setRemoveConfirmation(false);
        }
    };

    const handleWishlistItem = (cartItemId, productId) => {
        setMoveConfirmation(true);
        setItemToMove({ cartItemId, productId });
    };

    const handleMoveConfirmation = () => {
        if (itemToMove) {
            dispatch(addToWishlist(itemToMove.productId));
            dispatch(removeFromCart(itemToMove.cartItemId));
            setItemToMove(null);
            setMoveConfirmation(false);
        }
    };

    const handleClearCart = () => {
        setClearConfirmation(true);
    };

    const handleClearConfirmation = () => {
        dispatch(clearCart());
        setClearConfirmation(false);
    };

    if (loading && !cart) {
        return <Loader />;
    };

    if (error) {
        return <ErrorPage code={400} title='An Error Occurred!' description={error} />;
    };

    if (!cart || cart.totalItem === 0) {
        return <EmptyPage
            image={"/empty-trolley.jpg"}
            title={"Your Cart is Empty!"}
            description={"Looks like you haven't added anything to your cart yet. Explore our collection and add your favorite items!"}
            button={"Shop Now"}
            navigation={"/"}
        />;
    };

    return (
        <div className="min-h-[60vh] flex justify-center">
            <div className="w-11/12 xl:w-5/6 2xl:w-3/4 py-8">
                <p className="text-2xl font-semibold mb-6">Shopping Cart ({cart.totalItem} items)</p>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                                <div className="col-span-4">
                                    <h3 className="font-medium">Product</h3>
                                </div>
                                <div className="col-span-2 text-center">
                                    <h3 className="font-medium">Price</h3>
                                </div>
                                <div className="col-span-2 text-center">
                                    <h3 className="font-medium">Size</h3>
                                </div>
                                <div className="col-span-2 text-center">
                                    <h3 className="font-medium">Quantity</h3>
                                </div>
                                <div className="col-span-2 text-right">
                                    <h3 className="font-medium">Total</h3>
                                </div>
                            </div>

                            {cart && cart.cartItems?.map((item, index) => (
                                <div key={index} className="border-b border-gray-200 last:border-0 p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        {/* Product Info */}
                                        <div className="col-span-1 md:col-span-4 flex items-center">
                                            <div className="w-20 md:w-24 flex-shrink-0 rounded-md overflow-hidden">
                                                <img
                                                    src={item.product.preview}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-medium text-gray-800">{item.product.title}</h3>
                                                <p className="text-sm text-gray-500">{item.product.brand}</p>
                                                <p className="text-sm text-gray-500">{item.product.color}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                                            <span className="text-sm font-medium md:hidden">Price:</span>
                                            <div className="text-right md:text-center flex items-center gap-2 md:block">
                                                <p className="font-medium">{currency} {item.product.discountedPrice}</p>
                                                <p className="text-sm text-gray-500 line-through">{currency} {item.product.price}</p>
                                            </div>
                                        </div>

                                        {/* Size */}
                                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                                            <span className="text-sm font-medium md:hidden">Size:</span>
                                            <div className="w-20 xl:w-24">
                                                {item.product.sizes && item.product.sizes.length > 0 ? (
                                                    <SizeDropdown
                                                        sizes={item.product.sizes}
                                                        currentSize={item.size}
                                                        onSizeChange={(newSize) => handleSizeChange(item.id, newSize, item.size)}
                                                    />
                                                ) : (
                                                    <div className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-center">
                                                        {item.size}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                                            <span className="text-sm font-medium md:hidden">Quantity:</span>
                                            <div className="w-20 xl:w-24 flex items-center justify-around border border-gray-300 rounded-md py-0.5">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.quantity)}
                                                    className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                                >
                                                    <MinusIcon size={16} />
                                                </button>
                                                <span className="text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.quantity)}
                                                    className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                                >
                                                    <PlusIcon size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                                            <span className="text-sm font-medium md:hidden">Total:</span>
                                            <div className="text-right flex items-center gap-2 md:block">
                                                <p className="font-medium">{currency} {item.discountedPrice}</p>
                                                <p className="text-sm text-gray-500 line-through">{currency} {item.price}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 mt-4 md:mt-2">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                                        >
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => handleWishlistItem(item.id, item.product.id)}
                                            className="border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                                        >
                                            Move to Wishlist
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="p-4 flex justify-between gap-4 border-t bg-gray-50 border-gray-200">
                                <button
                                    onClick={handleClearCart}
                                    className="flex items-center gap-2 px-4 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded transition duration-300"
                                >
                                    <TrashIcon size={14} className="mr-1" />
                                    Clear Cart
                                </button>
                                <Link to="/products" >
                                    <button
                                        className='px-4 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded transition duration-300'
                                    >
                                        Continue Shopping
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({cart.totalItem} items)</span>
                                    <span>{currency} {cart.totalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="text-green-600">-{currency} {cart.discount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery</span>
                                    <span>Free</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between font-semibold">
                                    <span>Total Amount</span>
                                    <span>{currency} {cart.totalDiscountedPrice}</span>
                                </div>
                                <div className="text-sm text-green-600 mt-1 text-right">
                                    You save {currency} {cart.discount} on this order
                                </div>
                            </div>

                            <Link to="/checkout/shipping">
                                <button
                                    className='block w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition-all duration-300'
                                >
                                    Proceed to Checkout
                                </button>
                            </Link>

                            <div className='flex items-center gap-2 mt-4 text-sm text-gray-500'>
                                <ShieldCheck size={28} />
                                Safe and Secure Payments. Easy returns. 100% Authentic products.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Confirmation
                isOpen={removeConfirmation}
                onClose={() => setRemoveConfirmation(false)}
                onConfirm={handleRemoveConfirmation}
                title="Remove Product"
                message="Are you sure you want to remove this product? This action cannot be undone."
                confirmText="Remove"
                cancelText="Cancel"
            />

            <Confirmation
                isOpen={moveConfirmation}
                onClose={() => setMoveConfirmation(false)}
                onConfirm={handleMoveConfirmation}
                title="Move to Wishlist"
                message="Are you sure you want to move this product to your wishlist? This action cannot be undone."
                confirmText="Move"
                cancelText="Cancel"
            />

            <Confirmation
                isOpen={clearConfirmation}
                onClose={() => setClearConfirmation(false)}
                onConfirm={handleClearConfirmation}
                title="Clear Cart"
                message="Are you sure you want to clear your cart? This action cannot be undone."
                confirmText="Clear"
                cancelText="Cancel"
            />
        </div>
    );
};

export default CartPage;