const OrderDetails = ({ order }) => {
    if (!order) return null;

    return (
        <div className="p-4 md:p-6 border-b border-primary-200">
            <h4 className="text-md md:text-lg font-medium text-primary-800 mb-4">Order Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-primary-600">Order ID</p>
                    <p className="text-base font-medium text-primary-800">{order.orderId}</p>
                </div>

                <div>
                    <p className="text-sm text-primary-600">Order Date</p>
                    <p className="text-base font-medium text-primary-800">
                        {new Date().toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-primary-600">Total Amount</p>
                    <p className="text-base font-medium text-primary-800">
                        ₹{(order.totalDiscountedPrice || order.totalPrice).toFixed(2)}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-primary-600">Payment Method</p>
                    <p className="text-base font-medium text-primary-800">Razorpay</p>
                </div>

                {order.paymentInfo && (
                    <div>
                        <p className="text-sm text-primary-600">Payment ID</p>
                        <p className="text-base font-medium text-primary-800">
                            {order.paymentInfo.razorpayPaymentId || 'N/A'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;