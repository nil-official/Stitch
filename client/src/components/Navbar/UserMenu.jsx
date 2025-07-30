import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { AUTH_ROUTES, USER_ROUTES } from '../../routes/routePaths';
import { logout } from '../../redux/auth/action';
import { getProfile } from '../../redux/customer/profile/action';

const UserMenu = () => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);

    const profileRef = useRef(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProfile());
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setShowProfileDropdown(false);
        dispatch(logout());
    };

    return (
        isAuthenticated && profile ? (
            <div className="relative" ref={profileRef}>
                <div
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="hidden md:flex items-center justify-center min-w-36 space-x-2 px-3 py-2 rounded-md hover:bg-primary-800 transition-colors cursor-pointer"
                >
                    <User className="w-6 h-6" />
                    <span className="text-sm font-medium">
                        {profile.firstName}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                {showProfileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-primary-200 rounded-md shadow-lg z-50">
                        <Link to={USER_ROUTES.ACCOUNT}>
                            <div
                                onClick={() => setShowProfileDropdown(false)}
                                className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-100 cursor-pointer"
                            >
                                <User className="w-4 h-4 text-primary-600" />
                                <span className="text-primary-700">Account</span>
                            </div>
                        </Link>

                        <Link to={USER_ROUTES.ACCOUNT}>
                            <div
                                onClick={() => setShowProfileDropdown(false)}
                                className="flex items-center space-x-3 px-4 py-2 hover:bg-primary-100 cursor-pointer"
                            >
                                <Settings className="w-4 h-4 text-primary-600" />
                                <span className="text-primary-700">Settings</span>
                            </div>
                        </Link>

                        <div
                            onClick={handleLogout}
                            className="flex items-center border-t border-primary-200 space-x-3 px-4 py-2 hover:bg-red-50 cursor-pointer"
                        >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span className="text-red-700">Logout</span>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <Link to={AUTH_ROUTES.LOGIN}>
                <div className="hidden md:flex items-center justify-center min-w-36 space-x-2 px-3 py-2 rounded-md hover:bg-primary-800 transition-colors cursor-pointer">
                    <User className="w-6 h-6" />
                    <span className="text-sm font-medium">Login</span>
                </div>
            </Link>
        )
    )
}

export default UserMenu;