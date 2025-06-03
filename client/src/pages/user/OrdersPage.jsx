import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, CreditCard, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { getUserOrders } from '../../redux/customer/order/action';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(getUserOrders());
    }, [dispatch]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('var', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'placed':
                return 'success';
            case 'pending':
                return 'error';
            case 'shipped':
            case 'delivered':
                return 'primary';
            default:
                return 'primary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'placed':
                return <CheckCircle size={16} />;
            case 'pending':
                return <Clock size={16} />;
            case 'shipped':
                return <Truck size={16} />;
            default:
                return <Package size={16} />;
        }
    };

    const OrderCard = ({ order }) => {
        const statusColor = getStatusColor(order.orderStatus);
        const paymentStatusColor = getStatusColor(order.paymentDetails.status);

        return (
            <div className="bg-white rounded-lg border border-primary-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Order Header */}
                <div className="p-4 bg-primary-50 border-b border-primary-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h3 className="text-lg font-semibold text-primary-800">
                                Order #{order.orderId}
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-700`}>
                                    {getStatusIcon(order.orderStatus)}
                                    {order.orderStatus}
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${paymentStatusColor}-100 text-${paymentStatusColor}-700`}>
                                    <CreditCard size={12} />
                                    {order.paymentDetails.status}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-primary-600">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(order.createdAt)}
                            </div>
                            <span className="hidden sm:block">•</span>
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {formatTime(order.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                    <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-16 sm:w-20 flex-shrink-0">
                                    <img
                                        src={item.product.preview}
                                        alt={item.product.title}
                                        className="w-full h-full object-cover rounded-lg border border-primary-200"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-primary-800 truncate">
                                        {item.product.title}
                                    </h4>
                                    <p className="text-sm text-primary-600 mt-1">
                                        {item.product.brand}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                                        <span className="text-primary-600">
                                            Color: {item.product.color}
                                        </span>
                                        <span className="text-primary-400">•</span>
                                        <span className="text-primary-600">
                                            Size: {item.product.size}
                                        </span>
                                        <span className="text-primary-400">•</span>
                                        <span className="text-primary-600">
                                            Qty: {item.product.quantity}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="font-semibold text-primary-800">
                                            ₹{item.product.discountedPrice}
                                        </span>
                                        <span className="text-sm text-primary-500 line-through">
                                            ₹{item.product.price}
                                        </span>
                                        <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">
                                            {item.product.discountPercent}% OFF
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary & Details */}
                <div className="p-4 bg-primary-50 border-t border-primary-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Delivery Info */}
                        <div className="space-y-3">
                            <h5 className="font-medium text-primary-800 flex items-center gap-2">
                                <MapPin size={16} />
                                Delivery Address
                            </h5>
                            <div className="text-sm text-primary-600 ml-6">
                                <p className="font-medium">
                                    {order.address.firstName} {order.address.lastName}
                                </p>
                                <p>{order.address.streetAddress}</p>
                                <p>
                                    {order.address.city}, {order.address.state} {order.address.zipCode}
                                </p>
                                <p className="flex items-center gap-1 mt-1">
                                    <span>📞</span>
                                    {order.address.mobile}
                                </p>
                            </div>
                            <div className="text-sm text-success-600 ml-6">
                                <p className="flex items-center gap-1">
                                    <Truck size={14} />
                                    Expected Delivery: {formatDate(order.deliveryDate)}
                                </p>
                            </div>
                        </div>

                        {/* Payment & Pricing */}
                        <div className="space-y-3">
                            <h5 className="font-medium text-primary-800 flex items-center gap-2">
                                <CreditCard size={16} />
                                Payment Details
                            </h5>
                            <div className="text-sm text-primary-600 ml-6 space-y-1">
                                <div className="flex justify-between">
                                    <span>Subtotal ({order.totalItem} items)</span>
                                    <span>₹{order.totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-success-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discount}</span>
                                </div>
                                <div className="flex justify-between text-success-600">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <hr className="border-primary-200" />
                                <div className="flex justify-between font-semibold text-primary-800">
                                    <span>Total Amount</span>
                                    <span>₹{order.totalDiscountedPrice}</span>
                                </div>
                                <div className="text-xs text-primary-500 mt-2">
                                    Payment Method: {order.paymentDetails.paymentMethod}
                                </div>
                                {order.paymentDetails.paymentId && (
                                    <div className="text-xs text-primary-500">
                                        Payment ID: {order.paymentDetails.paymentId}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-primary-200">
                        <button className="px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors duration-300 text-sm font-medium">
                            Track Order
                        </button>
                        <button className="px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors duration-300 text-sm font-medium">
                            View Details
                        </button>
                        {order.orderStatus === 'PLACED' && (
                            <button className="px-4 py-2 border border-error-300 text-error-600 rounded-lg hover:bg-error-50 transition-colors duration-300 text-sm font-medium">
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center gap-8 py-8 lg:py-12'>
                <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
                    <div className='flex items-center gap-4 mb-6'>
                        <Link to='/' className="text-primary-700 hover:text-primary-800 transition-all duration-300">
                            <ChevronLeft size={32} />
                        </Link>
                        <p className="text-2xl font-semibold">My Orders</p>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center gap-8 py-8 lg:py-12'>
                <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
                    <div className='flex items-center gap-4 mb-6'>
                        <Link to='/' className="text-primary-700 hover:text-primary-800 transition-all duration-300">
                            <ChevronLeft size={32} />
                        </Link>
                        <p className="text-2xl font-semibold">My Orders</p>
                    </div>
                    <div className="text-center py-12">
                        <XCircle size={64} className="mx-auto text-error-500 mb-4" />
                        <h3 className="text-xl font-semibold text-primary-800 mb-2">
                            Failed to Load Orders
                        </h3>
                        <p className="text-primary-600 mb-4">{error}</p>
                        <button
                            onClick={() => dispatch(getUserOrders())}
                            className="px-6 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-[60vh] flex flex-col items-center gap-8 py-8 lg:py-12'>
            <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
                <div className='flex items-center gap-4 mb-6'>
                    <Link to='/' className="text-primary-700 hover:text-primary-800 transition-all duration-300">
                        <ChevronLeft size={32} />
                    </Link>
                    <p className="text-2xl font-semibold">My Orders ({orders.length} items)</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package size={64} className="mx-auto text-primary-400 mb-4" />
                        <h3 className="text-xl font-semibold text-primary-800 mb-2">
                            No Orders Yet
                        </h3>
                        <p className="text-primary-600 mb-6">
                            Looks like you haven't placed any orders yet. Start shopping to see your orders here!
                        </p>
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors duration-300 font-medium"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;