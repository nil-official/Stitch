import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCardIcon, CircleDollarSignIcon, WalletIcon, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import CheckoutSteps from '../../components/CheckoutSteps';
import OrderSummary from '../../components/Order/OrderSummary';
import { getCart } from '../../redux/customer/cart/action';
import { getProfile } from '../../redux/customer/profile/action';
import { getAddress } from '../../redux/customer/address/action';

const SummaryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currency, setCurrency] = useState('INR');
    const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
    const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
    const { address: addresses, loading: addressLoading, error: addressError } = useSelector((state) => state.address);

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!cart) dispatch(getCart());
    }, [cart, dispatch]);

    useEffect(() => {
        if (!addresses) dispatch(getAddress());
    }, [addresses, dispatch]);

    useEffect(() => {
        if (!profile) dispatch(getProfile());
    }, [profile, dispatch]);

    useEffect(() => {
        // dispatch(getCart());
        // dispatch(getAddress());

        // Get selectedAddressId from sessionStorage
        const storedAddressId = sessionStorage.getItem('selectedAddressId');
        if (storedAddressId) {
            setSelectedAddressId(Number(storedAddressId));
        }
    }, [dispatch]);

    useEffect(() => {
        if (addresses && addresses.length > 0 && selectedAddressId) {
            const address = addresses.find(addr => addr.id === selectedAddressId);
            if (address) {
                setSelectedAddress(address);
            } else if (!selectedAddressId && addresses.length > 0) {
                // If no address is selected yet, use the first one
                setSelectedAddressId(addresses[0].id);
                setSelectedAddress(addresses[0]);
            }
        }
    }, [addresses, selectedAddressId]);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        setIsProcessing(true);

        // Simulate API call for placing order
        setTimeout(() => {
            setIsProcessing(false);
            toast.success('Order placed successfully!');
            // Redirect to order confirmation page (in a real app)
            navigate('/order-confirmation');
        }, 1500);
    };

    if ((cartLoading && !cart) || (addressLoading && !addresses)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (cartError || addressError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">Something went wrong</p>
                    <p className="mt-2">{cartError || addressError}</p>
                    <button
                        className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                        onClick={() => {
                            dispatch(getCart());
                            dispatch(getAddress());
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-semibold">Your cart is empty</p>
                    <Link
                        to="/products"
                        className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] flex flex-col justify-center items-center gap-8 py-8 lg:py-12">
            <CheckoutSteps
                currentStep={3}
                disabledSteps={[]}
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
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-lg font-semibold">Delivery Address</h2>
                                <Link
                                    to="/checkout/address"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Change
                                </Link>
                            </div>

                            {selectedAddress ? (
                                <div>
                                    <p className="font-medium">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                                    <p className="text-gray-600 mt-1">{selectedAddress.streetAddress}</p>
                                    <p className="text-gray-600">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}</p>
                                    <p className="text-gray-600 mt-1">Mobile: {selectedAddress.mobile}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No address selected. Please go back and select a delivery address.</p>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-lg font-semibold">Order Items ({cart.totalItem})</h2>
                                <Link
                                    to="/cart"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {cart.cartItems.map((item) => (
                                    <div key={item.id} className="flex items-start border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product.preview}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <h3 className="font-medium text-gray-800">{item.product.title}</h3>
                                            <p className="text-sm text-gray-500">{item.product.brand}</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-sm text-gray-500 mr-3">Size: {item.size}</span>
                                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">₹{item.discountedPrice * item.quantity}</p>
                                            {item.discountedPrice < item.price && (
                                                <p className="text-sm text-gray-500 line-through">₹{item.price * item.quantity}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

                            <div className="space-y-3">
                                <div
                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => handlePaymentMethodChange('card')}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => handlePaymentMethodChange('card')}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <div className="ml-3 flex items-center">
                                            <CreditCardIcon size={20} className="text-gray-600 mr-2" />
                                            <span className="font-medium">Credit / Debit Card</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => handlePaymentMethodChange('upi')}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'upi'}
                                            onChange={() => handlePaymentMethodChange('upi')}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <div className="ml-3 flex items-center">
                                            <CircleDollarSignIcon size={20} className="text-gray-600 mr-2" />
                                            <span className="font-medium">UPI Payment</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => handlePaymentMethodChange('cod')}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => handlePaymentMethodChange('cod')}
                                            className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <div className="ml-3 flex items-center">
                                            <WalletIcon size={20} className="text-gray-600 mr-2" />
                                            <span className="font-medium">Cash on Delivery</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {cart && cart.totalItem > 0 && (
                        <div className="w-full lg:w-1/3">
                            <OrderSummary
                                cart={cart}
                                currency={currency}
                                selectedAddressId={selectedAddressId}
                                checkoutPath="/checkout/payment"
                                disableCheckoutButton={!selectedAddressId}
                                customButtonText={selectedAddressId ? "Continue to Payment" : "Select Address to Continue"}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;