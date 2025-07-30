import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, MapPin, Package, Heart, Headset, LogOut } from 'lucide-react';
import { AUTH_ROUTES, BASE_ROUTES, USER_ROUTES } from '../../routes/routePaths';
import SearchBox from './SearchBox';
import { logout } from '../../redux/auth/action';

const Mobile = ({ menuRef, onMobileItem, isMobileMenuOpen }) => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
    const { address, loading: addressLoading, error: addressError } = useSelector((state) => state.address);
    const defaultAddress = address?.find(addr => addr.isDefault);

    const handleLogout = () => {
        onMobileItem();
        dispatch(logout());
    };

    return (
        <div>
            <div className="md:hidden bg-white border-b border-primary-200 px-4 py-2">
                <SearchBox />
            </div>

            {isMobileMenuOpen && (
                <div
                    ref={menuRef}
                    className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-primary-200"
                >
                    <div className="flex flex-col px-4 py-2 text-primary-700">

                        <Link to={USER_ROUTES.ACCOUNT}>
                            <div
                                onClick={onMobileItem}
                                className="flex items-center gap-2 py-2"
                            >
                                <User className="w-5 h-5 text-primary-600" />
                                <span>
                                    {isAuthenticated && profile ?
                                        'Hello, ' + profile.firstName : 'Account'
                                    }
                                </span>
                            </div>
                        </Link>

                        {defaultAddress && (
                            <Link to={USER_ROUTES.ADDRESS}>
                                <div
                                    onClick={onMobileItem}
                                    className="flex items-center gap-2 py-2"
                                >
                                    <MapPin className="w-5 h-5 text-primary-600" />
                                    <span>
                                        Deliver to {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.zipCode}
                                    </span>
                                </div>
                            </Link>
                        )}

                        <Link to={USER_ROUTES.ORDERS}>
                            <div
                                onClick={onMobileItem}
                                className="flex items-center gap-2 py-2"
                            >
                                <Package className="w-5 h-5 text-primary-600" />
                                <span>Track Order</span>
                            </div>
                        </Link>

                        <Link to={USER_ROUTES.WISHLIST}>
                            <div
                                onClick={onMobileItem}
                                className="flex items-center gap-2 py-2"
                            >
                                <Heart className="w-5 h-5 text-primary-600" />
                                <span>Wishlist</span>
                            </div>
                        </Link>

                        <Link to={BASE_ROUTES.HELP}>
                            <div
                                onClick={onMobileItem}
                                className="flex items-center gap-2 py-2"
                            >
                                <Headset className="w-5 h-5 text-primary-600" />
                                <span>Customer Service</span>
                            </div>
                        </Link>

                        {isAuthenticated ? (
                            <div
                                onClick={handleLogout}
                                className="flex items-center gap-2 py-2"
                            >
                                <LogOut className="w-5 h-5 text-primary-600" />
                                <span>Logout</span>
                            </div>
                        ) : (
                            <Link to={AUTH_ROUTES.LOGIN}>
                                <div
                                    onClick={onMobileItem}
                                    className="flex items-center gap-2 py-2"
                                >
                                    <User className="w-5 h-5 text-primary-600" />
                                    <span>Login</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Mobile;