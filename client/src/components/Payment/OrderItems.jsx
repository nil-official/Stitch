import OrderItem from "./OrderItem";

const OrderItems = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="p-4 md:p-6 border-b border-primary-200">
            <h4 className="text-md md:text-lg font-medium text-primary-800 mb-4">Order Items</h4>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <OrderItem key={index} item={item} />
                ))}
            </div>
        </div>
    );
};

export default OrderItems;