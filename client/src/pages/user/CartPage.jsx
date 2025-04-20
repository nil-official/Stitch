import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronLeft, TrashIcon } from 'lucide-react';
import EmptyPage from '../EmptyPage';
import ErrorPage from '../ErrorPage';
import Loader from '../../components/Loader';
import Confirmation from '../../components/Confirmation';
import CheckoutSteps from '../../components/CheckoutSteps';
import CartItemList from '../../components/Cart/CartItemList';
import OrderSummary from '../../components/Order/OrderSummary';
import { addToWishlist } from '../../redux/customer/wishlist/action';
import { getCart, updateCart, removeFromCart, clearCart } from '../../redux/customer/cart/action';

const CartPage = () => {
    const dispatch = useDispatch();
    const [currency, setCurrency] = useState('INR');
    const { cart, loading, error } = useSelector((state) => state.cart);

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    });

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
        setConfirmation({
            isOpen: true,
            onConfirm: () => {
                dispatch(removeFromCart(cartItemId));
                closeConfirmation();
            },
            title: "Remove Product",
            message: "Are you sure you want to remove this product? This action cannot be undone.",
            confirmText: "Remove",
            cancelText: "Cancel",
        });
    };

    const handleWishlistItem = (cartItemId, productId) => {
        setConfirmation({
            isOpen: true,
            onConfirm: () => {
                dispatch(addToWishlist(productId));
                dispatch(removeFromCart(cartItemId));
                closeConfirmation();
            },
            title: "Move to Wishlist",
            message: "Are you sure you want to move this product to your wishlist? This action cannot be undone.",
            confirmText: "Move",
            cancelText: "Cancel",
        });
    };

    const handleClearCart = () => {
        setConfirmation({
            isOpen: true,
            onConfirm: () => {
                dispatch(clearCart());
                closeConfirmation();
            },
            title: "Clear Cart",
            message: "Are you sure you want to clear your cart? This action cannot be undone.",
            confirmText: "Clear",
            cancelText: "Cancel",
        });
    };

    const closeConfirmation = () => {
        setConfirmation(prev => ({ ...prev, isOpen: false }));
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
        <div className="min-h-[60vh] flex flex-col justify-center items-center gap-8 py-8 lg:py-12">
            <CheckoutSteps
                currentStep={1}
                disabledSteps={cart && cart.totalItem > 0 ? [3, 4] : [2, 3, 4]}
            />

            {cart && cart.totalItem > 0 && (
                <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
                    <div className='flex items-center gap-4 mb-6'>
                        <Link to='/' className="text-gray-600 hover:text-gray-800 transition-all duration-300">
                            <ChevronLeft size={32} />
                        </Link>
                        <p className="text-2xl font-semibold">Shopping Cart ({cart.totalItem} items)</p>
                    </div>

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

                                <CartItemList
                                    cartItems={cart.cartItems}
                                    currency={currency}
                                    onQuantityChange={handleQuantityChange}
                                    onSizeChange={handleSizeChange}
                                    onRemoveItem={handleRemoveItem}
                                    onMoveToWishlist={handleWishlistItem}
                                />

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

                        <div className="w-full lg:w-1/3">
                            <OrderSummary
                                cart={cart}
                                currency={currency}
                                checkoutPath="/checkout/shipping"
                            />
                        </div>
                    </div>
                </div>
            )}

            <Confirmation
                isOpen={confirmation.isOpen}
                onClose={closeConfirmation}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                confirmText={confirmation.confirmText}
                cancelText={confirmation.cancelText}
            />
        </div>
    );
};

export default CartPage;