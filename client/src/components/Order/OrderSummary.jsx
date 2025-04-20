import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const OrderSummary = ({
    cart,
    currency = 'INR',
    selectedAddressId = null,
    checkoutPath = "/checkout/shipping",
    disableCheckoutButton = false,
    customButtonText = null
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

    return (
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

            {isButtonDisabled ? (
                <button
                    className="block w-full bg-gray-400 text-white py-2 rounded"
                    disabled
                >
                    {buttonText}
                </button>
            ) : (
                <Link to={buttonLink}>
                    <button
                        className="block w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition-all duration-300"
                    >
                        {buttonText}
                    </button>
                </Link>
            )}

            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <ShieldCheck size={28} />
                <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>
        </div>
    );
};

export default OrderSummary;