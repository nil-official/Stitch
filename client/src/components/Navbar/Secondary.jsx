import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Package, Heart, Headset } from 'lucide-react';
import { BASE_ROUTES, USER_ROUTES } from '../../routes/routePaths';
import { getAddress } from '../../redux/customer/address/action';

const Secondary = () => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { address, loading: addressLoading, error: addressError } = useSelector((state) => state.address);

    useEffect(() => {
        if (isAuthenticated) dispatch(getAddress());
    }, [isAuthenticated, dispatch]);

    const defaultAddress = address?.find(addr => addr.isDefault);

    return (
        <div className="hidden md:block bg-primary-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-10">

                    <div className="flex items-center gap-6">
                        {isAuthenticated && address && defaultAddress && (
                            <Link to={USER_ROUTES.ADDRESS}>
                                <button className="flex items-center space-x-1 hover:text-primary-200 transition-colors">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">
                                        Deliver to {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.zipCode}
                                    </span>
                                </button>
                            </Link>
                        )}

                        <Link to={USER_ROUTES.ORDERS}>
                            <button className="flex items-center space-x-1 hover:text-primary-200 transition-colors">
                                <Package className="w-4 h-4" />
                                <span className="text-sm">Track Order</span>
                            </button>
                        </Link>

                        <Link to={USER_ROUTES.WISHLIST}>
                            <button className="flex items-center space-x-1 hover:text-primary-200 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">Wishlist</span>
                            </button>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                        <Link to={BASE_ROUTES.HELP}>
                            <button className="flex items-center space-x-1 hover:text-primary-200 transition-colors">
                                <Headset className="w-4 h-4" />
                                <span className="text-sm">Customer Service</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Secondary;