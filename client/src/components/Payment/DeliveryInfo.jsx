const DeliveryInfo = ({ orderAddress }) => {
    if (!orderAddress) return null;

    // Calculate estimated delivery date (7 days from now)
    const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

    return (
        <div className="p-4 md:p-6 border-b border-primary-200">
            <h4 className="text-md md:text-lg font-medium text-primary-800 mb-4">Delivery Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                    <p className="text-sm text-primary-600">Shipping Address</p>
                    <div className="text-base text-primary-800 mt-1">
                        <p className="font-medium">{orderAddress.name}</p>
                        <p>{orderAddress.streetAddress}</p>
                        <p>{orderAddress.city}, {orderAddress.state} {orderAddress.zipCode}</p>
                        <p>Phone: {orderAddress.mobile}</p>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-primary-600">Estimated Delivery</p>
                    <p className="text-base font-medium text-success-600 mt-1">{estimatedDelivery}</p>
                    <p className="text-sm text-primary-500 mt-1">Your order will be delivered within 7 days</p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryInfo;