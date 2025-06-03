import { Link } from "react-router-dom";

const ActionButtons = ({ success, orderId }) => {
    return (
        <div className="p-4 md:p-6 bg-primary-50 flex flex-col md:flex-row gap-3 md:gap-4 justify-end">
            {success ? (
                <>
                    <Link to="/">
                        <button
                            className="px-4 py-2 border border-primary-300 text-primary-700 rounded hover:bg-primary-100 transition-all duration-300"
                        >
                            Continue Shopping
                        </button>
                    </Link>
                    {/* <Link to={`/order/${orderId}`}>
                        <button
                            className="px-4 py-2 border border-primary-600 bg-primary-600 text-white rounded hover:bg-primary-700 transition-all duration-300"
                        >
                            View Order Details
                        </button>
                    </Link> */}
                    <Link to="/user/orders">
                        <button
                            className="px-4 py-2 border border-primary-600 bg-primary-600 text-white rounded hover:bg-primary-700 transition-all duration-300"
                        >
                            My Orders
                        </button>
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/checkout/summary">
                        <button
                            className="px-4 py-2 border border-primary-600 bg-primary-600 text-white rounded hover:bg-primary-700 transition-all duration-300"
                        >
                            Retry Payment
                        </button>
                    </Link>
                    <Link to={"/cart"}>
                        <button
                            className="px-4 py-2 border border-primary-300 text-primary-700 rounded hover:bg-primary-100 transition-all duration-300"
                        >
                            Return to Cart
                        </button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default ActionButtons;