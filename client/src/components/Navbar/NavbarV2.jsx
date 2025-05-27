import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, MapPin, Package, Heart, ChevronDown, Headset, History, TrendingUp } from 'lucide-react';
import { BASE_ROUTES, USER_ROUTES, CHECKOUT_ROUTES } from '../../routes/routePaths';
import { logout } from '../../redux/auth/action';
import { getCart } from '../../redux/customer/cart/action';
import { getProfile } from '../../redux/customer/profile/action';
import {
    getSearchSuggestions,
    saveSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
} from '../../redux/customer/suggestions/action';

const NavbarV2 = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
    const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
    const { suggestions, loading: suggestionsLoading, error: suggestionsError } = useSelector((state) => state.suggestions);

    const searchRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const HandleSearchChange = (e) => {
        console.log("handle seach change called");
        
        const value = e.target.value;
        setSearchQuery(value);
        dispatch(getSearchSuggestions(value));
    };

    const HandleSearchFocus = () => {
        console.log("handle search focus called");
        
        dispatch(getSearchSuggestions(searchQuery));
        setShowSearchSuggestions(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const formattedInput = searchQuery.trim().replace(/\s+/g, '+');
            dispatch(saveSearchHistory(formattedInput));
            setShowSearchSuggestions(false);
            navigate(`/search?q=${formattedInput}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery('');
        setIsSearchOpen(false);
        const formattedInput = suggestion.trim().replace(/\s+/g, '+');
        navigate(`/search?q=${formattedInput}`);
    };

    const handleRemoveHistory = (e, phraseId) => {
        console.log("Removing search history for phraseId:", phraseId);
        e.stopPropagation();
        dispatch(removeSearchHistory(phraseId));
        dispatch(getSearchSuggestions(searchQuery));
        setShowSearchSuggestions(true);
    };

    // Get suggestion icon
    const getSuggestionIcon = (type) => {
        switch (type) {
            case 'history':
                return <History className="w-4 h-4 text-primary-500" />;
            case 'suggestion':
                return <TrendingUp className="w-4 h-4 text-primary-500" />;
            default:
                return <Search className="w-4 h-4 text-primary-500" />;
        }
    };

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md">
            {/* Main Navbar */}
            <div className="bg-primary-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md hover:bg-primary-800 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Logo */}
                        <Link to={BASE_ROUTES.HOME}>
                            <div className="flex-shrink-0">
                                <div className="text-3xl font-bold">
                                    Stitch
                                </div>
                            </div>
                        </Link>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
                            <div className="relative w-full">
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={HandleSearchChange}
                                        onFocus={HandleSearchFocus}
                                        // onChange={(e) => setSearchQuery(e.target.value)}
                                        // onFocus={() => setShowSearchSuggestions(true)}
                                        // onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 150)}
                                        placeholder="Search for shirts, jackets, and more..."
                                        className="w-full px-4 py-2 pl-10 pr-12 text-primary-900 bg-white rounded-md focus:outline-none"
                                    />
                                </form>

                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />

                                {/* Search Suggestions */}
                                {showSearchSuggestions && suggestions?.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-primary-200 rounded-md mt-1 max-h-80 overflow-y-auto shadow-lg z-50">
                                        <div className="">
                                            {suggestions.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between px-4 py-2 hover:bg-primary-100 rounded cursor-pointer group"
                                                >
                                                    <div
                                                        className="flex items-center space-x-3"
                                                        onClick={() => handleSuggestionClick(item.suggestion)}
                                                    >
                                                        {getSuggestionIcon(item.type)}
                                                        <span className="text-primary-700">{item.suggestion}</span>
                                                    </div>
                                                    {item.type === 'history' && (
                                                        <button
                                                            onClick={(e) => handleRemoveHistory(e, item.id)}
                                                            className=" p-1 hover:bg-primary-200 rounded transition-all"
                                                        >
                                                            <X className="w-4 h-4 text-primary-500" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {suggestions.some(item => item.type === 'history') && (
                                                <div className="px-4 py-2 flex justify-center border-t border-primary-200">
                                                    <button
                                                        onClick={() => dispatch(clearSearchHistory())}
                                                        className="text-primary-600 hover:text-primary-800"
                                                    >
                                                        Clear all history
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Profile */}
                            {profile && (
                                <Link to={USER_ROUTES.ACCOUNT}>
                                    <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-primary-800 transition-colors cursor-pointer">
                                        <User className="w-5 h-5" />
                                        <span className="text-sm font-medium">
                                            Hello, {profile.firstName}
                                        </span>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </Link>
                            )}

                            {/* Cart */}
                            {cart && (
                                <Link to={CHECKOUT_ROUTES.CART}>
                                    <div className="relative flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-primary-800 transition-colors cursor-pointer">
                                        <div className="relative">
                                            <ShoppingCart className="w-6 h-6" />
                                            {cart.totalItem > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                                    {cart.totalItem}
                                                </span>
                                            )}
                                        </div>
                                        <span className="hidden sm:inline text-sm font-medium">Cart</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Navbar */}
            <div className="bg-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="hidden md:flex items-center justify-between h-10">
                        <div className="flex items-center space-x-6">
                            <Link to={USER_ROUTES.ADDRESS}>
                                <button className="flex items-center space-x-1 hover:text-primary-200 transition-colors">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">Deliver to New York 10001</span>
                                </button>
                            </Link>

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

            {/* Mobile Search Bar */}
            <div className="md:hidden bg-white border-b border-primary-200 px-4 py-3" ref={searchRef}>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSearchSuggestions(true)}
                        onBlur={() => setShowSearchSuggestions(false)}
                        placeholder="Search for shirts, jackets, and more..."
                        className="w-full px-4 py-2 pl-10 pr-12 text-primary-900 bg-primary-50 border border-primary-200 rounded-md focus:outline-none"
                    />

                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />

                    {/* Mobile Search Suggestions */}
                    {showSearchSuggestions && suggestions?.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-primary-200 rounded-md mt-1 max-h-80 overflow-y-auto shadow-lg z-50">
                            <div className="p-2">
                                {suggestions.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(item.suggestion)}
                                        className="flex items-center justify-between p-2 hover:bg-primary-50 rounded cursor-pointer group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            {getSuggestionIcon(item.type)}
                                            <span className="text-primary-700">{item.suggestion}</span>
                                        </div>
                                        {item.type === 'history' && (
                                            <button
                                                onClick={(e) => handleRemoveHistory(e, item.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary-100 rounded transition-all"
                                            >
                                                <X className="w-4 h-4 text-primary-500" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-primary-200">
                    <div className="px-4 py-2 space-y-2">
                        {/* Profile Section */}
                        {profile && (
                            <Link to={USER_ROUTES.ACCOUNT}>
                                <div className="flex items-center space-x-3 py-3 border-b border-primary-100">
                                    <User className="w-6 h-6 text-primary-600" />
                                    <span className="text-primary-900 font-medium">
                                        Hello, {profile.firstName}
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Menu Items */}
                        <Link to={USER_ROUTES.ADDRESS}>
                            <button className="flex items-center space-x-3 w-full py-2 text-left hover:bg-primary-50 rounded transition-colors">
                                <MapPin className="w-5 h-5 text-primary-600" />
                                <span className="text-primary-900">Deliver to New York 10001</span>
                            </button>
                        </Link>

                        <Link to={USER_ROUTES.ORDERS}>
                            <button className="flex items-center space-x-3 w-full py-2 text-left hover:bg-primary-50 rounded transition-colors">
                                <Package className="w-5 h-5 text-primary-600" />
                                <span className="text-primary-900">Track Order</span>
                            </button>
                        </Link>

                        <Link to={USER_ROUTES.WISHLIST}>
                            <button className="flex items-center space-x-3 w-full py-2 text-left hover:bg-primary-50 rounded transition-colors">
                                <Heart className="w-5 h-5 text-primary-600" />
                                <span className="text-primary-900">Wishlist</span>
                            </button>
                        </Link>

                        <Link to={BASE_ROUTES.HELP}>
                            <button className="block w-full py-2 text-left text-primary-600 hover:text-primary-800 transition-colors">
                                Customer Service
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavbarV2;