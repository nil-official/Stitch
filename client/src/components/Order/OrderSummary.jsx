import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderSummary = ({
    cart,
    currency = 'INR',
    selectedAddressId = null,
    checkoutPath = "/checkout/shipping",
    disableCheckoutButton = false,
    customButtonText = null,
    onClick = null,
}) => {
    // Determine button text and state based on context
    let buttonText = customButtonText;
    let isButtonDisabled = disableCheckoutButton;
    let buttonLink = checkoutPath;

    // If we're in shipping page context (has selectedAddressId logic)
    if (selectedAddressId !== null && customButtonText === null) {
        buttonText = selectedAddressId ? "Continue to Checkout" : "Select Address to Continue";
        isButtonDisabled = !selectedAddressId;
    }
    // Default for cart page
    else if (customButtonText === null) {
        buttonText = "Proceed to Checkout";
        isButtonDisabled = false;
    }

    const handleProceedClick = (e) => {
        if (!cart || cart.totalItem === 0) {
            e.preventDefault();
            toast.error('Please select at least one item to proceed');
            return;
        }
        if (onClick) {
            onClick();
        }
    };

    return (
        <div className="rounded-lg shadow-sm border border-primary-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-primary-600">Subtotal ({cart.totalItem} items)</span>
                    <span>{currency} {cart.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-primary-600">Discount</span>
                    <span className="text-success-600">- {currency} {cart.discount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-primary-600">Shipping Charges</span>
                    <span>
                        <span className='text-sm line-through text-primary-600'>{currency} 50</span>
                        <span className='text-success-600'> FREE</span>
                    </span>
                </div>
            </div>

            <div className="border-t border-primary-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>{currency} {cart.totalDiscountedPrice}</span>
                </div>
                <div className="text-sm text-success-600 mt-1 text-right">
                    You're saving {currency} {cart.discount} on this order
                </div>
            </div>

            {isButtonDisabled ? (
                <button
                    className="block w-full text-white bg-primary-700 opacity-30 py-2 rounded"
                    disabled
                >
                    {buttonText}
                </button>
            ) : (
                <Link to={buttonLink}>
                    <button
                        onClick={handleProceedClick}
                        className="block w-full font-semibold text-white bg-primary-700 hover:bg-primary-800 py-2 rounded transition-all duration-300"
                    >
                        {buttonText}
                    </button>
                </Link>
            )}

            <div className="flex items-center gap-2 mt-4 text-sm text-primary-600">
                <ShieldCheck size={28} />
                <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>
        </div>
    );
};

export default OrderSummary;