import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCardIcon, CircleDollarSignIcon, WalletIcon, ChevronLeft, MapPin, Truck, ShoppingBag, User } from 'lucide-react';
import ErrorPage from '../ErrorPage';
import Loader from '../../components/Loader';
import CheckoutSteps from '../../components/CheckoutSteps';
import OrderSummary from '../../components/Order/OrderSummary';
import { getCart } from '../../redux/customer/cart/action';
import { getProfile } from '../../redux/customer/profile/action';
import { getAddress } from '../../redux/customer/address/action';
import { setOrderData } from '../../redux/customer/order/action';
import { getSelectedCartData } from '../../redux/customer/cart/selector';

const SummaryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currency, setCurrency] = useState('INR');
    const { cart, selectedItems, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
    const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
    const { address, selectedAddress, loading: addressLoading, error: addressError } = useSelector((state) => state.address);
    const selectedCartData = useSelector(getSelectedCartData);

    const [paymentMethod, setPaymentMethod] = useState('card');

    console.log('Selected Cart Data:', selectedCartData);
    console.log('Selected Address:', selectedAddress);
    
    

    useEffect(() => {
        if (!cart) dispatch(getCart());
    }, [cart, dispatch]);

    useEffect(() => {
        if (!address) dispatch(getAddress());
    }, [address, dispatch]);

    useEffect(() => {
        if (!profile) dispatch(getProfile());
    }, [profile, dispatch]);

    useEffect(() => {
        if (cart && cart.totalItem === 0) {
            navigate('/checkout/cart');
        }
    }, [cart, navigate]);

    useEffect(() => {
        if (!selectedAddress) {
            navigate('/checkout/shipping');
        }
    }, [selectedAddress, navigate]);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleProceedToPayment = () => {
        dispatch(setOrderData({
            orderItems: selectedCartData.cartItems,
            address: selectedAddress,
            paymentMethod: paymentMethod === 'cod' ? "COD" : "RAZORPAY",
        }));
    };

    if (cartError || addressError || profileError) {
        return <ErrorPage code={400} title='An Error Occurred!' description={cartError || addressError || profileError} />;
    };

    if ((!cart && cartLoading) || (!address && addressLoading) || (!profile && profileLoading)) {
        return <Loader />;
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center gap-8 py-8 lg:py-12">
            <CheckoutSteps
                currentStep={3}
                disabledSteps={[4]}
            />

            <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
                <div className='flex items-center gap-4 mb-6'>
                    <Link to='/checkout/shipping' className="text-gray-600 hover:text-gray-800 transition-all duration-300">
                        <ChevronLeft size={32} />
                    </Link>
                    <p className="text-2xl font-semibold">Order Summary</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Details */}
                    <div className="w-full lg:w-2/3">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Account Information</h2>
                                </div>
                            </div>

                            {profile && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Contact</p>
                                        <p className="font-medium">{profile.mobile}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{profile.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <div className="bg-green-50 p-2 rounded-full mr-3">
                                        <MapPin size={20} className="text-green-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Delivery Address</h2>
                                </div>
                                <Link
                                    to="/checkout/shipping"
                                    className="text-sm text-white bg-primary-700 hover:bg-primary-600 px-3 py-1 rounded-full transition duration-300"
                                >
                                    Change
                                </Link>
                            </div>

                            {selectedAddress ? (
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <p className="font-medium">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                                                <span className="ml-2 text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                                    {selectedAddress.type}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mt-1">{selectedAddress.streetAddress}</p>
                                            <p className="text-gray-700">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}</p>
                                            <p className="text-gray-700 mt-1">Mobile: {selectedAddress.mobile}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No address selected. Please go back and select a delivery address.</p>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <div className="bg-purple-50 p-2 rounded-full mr-3">
                                        <Truck size={20} className="text-purple-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Order Items ({cart.totalItem})</h2>
                                </div>
                                <Link
                                    to="/checkout/cart"
                                    className="text-sm text-white bg-primary-700 hover:bg-primary-600 px-3 py-1 rounded-full transition duration-300"
                                >
                                    Edit Cart
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {cart && cart.cartItems && cart.cartItems.map((item) => (
                                    <div key={item.id} className="flex items-start border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="w-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                            <img
                                                src={item.product.preview}
                                                alt={item.product.title}
                                                className="w-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <h3 className="font-medium text-gray-800 line-clamp-1">{item.product.title}</h3>
                                            <p className="text-sm text-gray-500">{item.product.brand} | {item.product.color}</p>
                                            <div className="flex items-center mt-2">
                                                <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full mr-2">
                                                    Size: {item.size}
                                                </span>
                                                <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                                    Qty: {item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-lg">₹{item.discountedPrice * item.quantity}</p>
                                            {item.discountedPrice < item.price && (
                                                <div className="flex items-center text-sm mt-1">
                                                    <p className="text-gray-500 line-through mr-2">₹{item.price * item.quantity}</p>
                                                    <span className="text-xs font-medium bg-success-50 text-success-600 px-2 py-1 rounded-md">
                                                        {item.product.discountPercent}% OFF
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Total Items:</span>
                                    <span className="font-medium">{cart.totalItem}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Total MRP:</span>
                                    <span className="font-medium">₹{cart.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-medium text-green-600">-₹{cart.discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                                    <span>Total Amount:</span>
                                    <span>₹{cart.totalDiscountedPrice.toFixed(2)}</span>
                                </div>
                            </div> */}
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-orange-50 p-2 rounded-full mr-3">
                                    <CreditCardIcon size={20} className="text-orange-600" />
                                </div>
                                <h2 className="text-lg font-semibold">Payment Method</h2>
                            </div>

                            <div className="space-y-3">
                                <div
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-700 bg-primary-50 shadow-sm' : 'border-primary-200 hover:border-primary-300'}`}
                                    onClick={() => handlePaymentMethodChange('card')}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => handlePaymentMethodChange('card')}
                                            className="h-4 w-4 accent-primary-700"
                                        />
                                        <div className="ml-3 flex flex-col sm:flex-row sm:items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <CreditCardIcon size={20} className="text-gray-600 mr-2" />
                                                <span className="font-medium">Razorpay (Credit / Debit Card / UPI)</span>
                                            </div>
                                            <div className="ml-7 sm:ml-0 mt-2 sm:mt-0">
                                                <span className="text-xs font-medium bg-success-50 text-success-600 px-2 py-1 rounded-md">
                                                    Recommended
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {paymentMethod === 'card' && (
                                        <div className="ml-7 mt-2 text-sm text-gray-600">
                                            Pay securely using Razorpay's payment gateway with Credit/Debit cards, UPI, or net banking.
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-700 bg-primary-50 shadow-sm' : 'border-primary-200 hover:border-primary-300'}`}
                                    onClick={() => handlePaymentMethodChange('cod')}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => handlePaymentMethodChange('cod')}
                                            className="h-4 w-4 accent-primary-700"
                                        />
                                        <div className="ml-3 flex items-center">
                                            <WalletIcon size={20} className="text-gray-600 mr-2" />
                                            <span className="font-medium">Cash on Delivery</span>
                                        </div>
                                    </div>
                                    {paymentMethod === 'cod' && (
                                        <div className="ml-7 mt-2 text-sm text-gray-600">
                                            Pay with cash when your order is delivered.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {cart && cart.totalItem > 0 && (
                        <div className="w-full lg:w-1/3">
                            <OrderSummary
                                cart={selectedItems.length === cart.cartItems.length ? cart : selectedCartData}
                                currency={currency}
                                selectedAddressId={selectedAddress}
                                checkoutPath="/checkout/payment"
                                disableCheckoutButton={!selectedAddress}
                                customButtonText={selectedAddress ? "Place Order" : "Select Address to Continue"}
                                onClick={handleProceedToPayment}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;