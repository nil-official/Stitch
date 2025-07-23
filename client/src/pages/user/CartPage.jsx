import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ShoppingCart, Trash } from 'lucide-react';
import EmptyPage from '../EmptyPage';
import ErrorPage from '../ErrorPage';
import Loader from '../../components/Loader';
import Confirmation from '../../components/Confirmation';
import CheckoutSteps from '../../components/CheckoutSteps';
import CartItemList from '../../components/Cart/CartItemList';
import OrderSummary from '../../components/Order/OrderSummary';
import { addToWishlist } from '../../redux/customer/wishlist/action';
import { getSelectedCartData } from '../../redux/customer/cart/selector';
import {
    getCart,
    updateCart,
    removeFromCart,
    clearCart,
    selectCartItem,
    deselectCartItem,
    selectAllCartItems,
    deselectAllCartItems,
} from '../../redux/customer/cart/action';
import { EMPTY_CART } from '../../assets/asset';
import { AUTH_ROUTES } from '../../routes/routePaths';

const CartPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { cart, selectedItems, loading, error } = useSelector((state) => state.cart);

    const [currency, setCurrency] = useState('INR');
    const selectedCartData = useSelector(getSelectedCartData);

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    });

    useEffect(() => {
        if (!isAuthenticated)
            navigate(AUTH_ROUTES.LOGIN);
        else
            dispatch(getCart());
    }, [isAuthenticated, dispatch]);

    const handleQuantityChange = (cartItemId, quantity, currentQuantity) => {
        if (quantity > 5) {
            toast.error("Maximum five units allowed per item.");
            return;
        }
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

    const handleSelectItem = (itemId) => {
        if (selectedItems.includes(itemId)) {
            dispatch(deselectCartItem(itemId));
        } else {
            dispatch(selectCartItem(itemId));
        }
    };

    const handleSelectAll = (select) => {
        if (select && cart && cart.cartItems) {
            dispatch(selectAllCartItems(cart.cartItems.map(item => item.id)));
        } else {
            dispatch(deselectAllCartItems());
        }
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
            heading={"Shopping Cart"}
            image={EMPTY_CART}
            title={"Your Cart is Empty!"}
            description={"Looks like you haven't added anything to your cart yet. Explore our collection and add your favorite items!"}
            button={"Shop Now"}
            forwardNav={"/products"}
        />;
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center gap-8 py-8 lg:py-12">
            <CheckoutSteps
                currentStep={1}
                disabledSteps={cart && cart.totalItem > 0 ? [3, 4] : [2, 3, 4]}
            />

            {cart && cart.totalItem > 0 && (
                <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
                    <div className='flex items-center gap-2 md:gap-4 mb-4 md:mb-6'>
                        <Link to='/' className="text-primary-700 hover:text-primary-800 transition-all duration-300">
                            <ChevronLeft className='w-6 h-6 md:w-8 md:h-8' />
                        </Link>
                        <p className="text-lg md:text-2xl font-semibold">Shopping Cart ({cart.totalItem} items)</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                        {/* Cart Items */}
                        <div className="w-full lg:w-2/3">
                            <CartItemList
                                cartItems={cart.cartItems}
                                currency={currency}
                                onQuantityChange={handleQuantityChange}
                                onSizeChange={handleSizeChange}
                                onRemoveItem={handleRemoveItem}
                                onMoveToWishlist={handleWishlistItem}
                                selectedItems={selectedItems}
                                onSelectItem={handleSelectItem}
                                onSelectAll={handleSelectAll}
                            />

                            <div className="mt-4 flex justify-end gap-4">
                                <button
                                    onClick={handleClearCart}
                                    className="flex items-center gap-2 px-4 py-2 font-semibold border border-error-600 text-error-600 hover:bg-error-50 rounded transition-all duration-300"
                                >
                                    <Trash className='w-4 h-4' />
                                    <span>Clear Cart</span>
                                </button>
                                <Link to="/products" >
                                    <button
                                        className='flex items-center gap-2 px-4 py-2 font-semibold border border-primary-600 text-primary-700 hover:bg-primary-50 rounded transition-all duration-300'
                                    >
                                        <ShoppingCart className='w-4 h-4' />
                                        <span>Continue Shopping</span>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-1/3">
                            <OrderSummary
                                cart={selectedItems.length === cart.cartItems.length ? cart : selectedCartData}
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