import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { History, TrendingUp, X } from "lucide-react";
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import decodeJWT from '../../utils/decodeJWT';
import { logout } from '../../redux/auth/action';
import { getCart } from '../../redux/customer/cart/action';
import {
    getSearchSuggestions,
    saveSearchHistory,
    removeSearchHistory,
    clearSearchHistory
} from '../../redux/customer/suggestions/action';

const Navbar = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
    const { searchSuggestions, loading: searchLoading, error: searchError } = useSelector((state) => state.search);

    const [query, setQuery] = useState('');
    const [isSidebarOpen, setSidebar] = useState(false);

    useEffect(() => {
        dispatch(getCart());
    }, []);

    useEffect(() => {
        dispatch(getSearchSuggestions(query));
    }, [dispatch, query, saveSearchHistory]);

    const handleSuggestionClick = (suggestion) => {
        setQuery('');
        setIsSearchOpen(false);
        navigate(`/search?q=${suggestion.replace(/\s+/g, '+')}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            const formattedInput = query.trim().replace(/\s+/g, '+');
            dispatch(saveSearchHistory(formattedInput));
            setQuery('');
            setIsSearchOpen(false);
            navigate(`/search?q=${formattedInput}`);
        }
    };

    const handleSearchIcon = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        }
    };

    const handleLogOut = () => {
        dispatch(logout());
        setSidebar(false);
        navigate("/");
    }

    const navlinks = [
        { name: "Home", link: "/" },
        { name: "Account", link: "/user/account" },
        { name: "Orders", link: "/user/orders" },
        { name: "Wishlist", link: "/user/wishlist" },
        { name: "Help & Support", link: "/help" },
        { name: "Log In", link: "/auth/login" },
    ];

    const adminNavlinks = [
        { name: "Home", link: "/" },
        { name: "Create Product", link: "/admin/products/create" },
        { name: "View Products", link: "/admin/products" },
        { name: "View Orders", link: "/admin/orders" },
        { name: "View Issues", link: "/admin/help" },
        { name: "View Users", link: "/admin/users" },
    ];

    const isLoggedIn = !!localStorage.getItem("jwtToken");
    const filteredNavlinks = navlinks.filter((link) => {
        if (isLoggedIn) {
            return link.name !== "Log In";
        } else {
            return link.name !== "Orders" &&
                link.name !== "Cart" &&
                link.name !== "Wishlist" &&
                link.name !== "Help & Support";
        }
    });

    return (
        <nav className="shadow-md">
            <div className="w-full flex flex-col justify-center items-center p-4">
                <div className="w-11/12 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setSidebar(true)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                            <FiMenu className="text-2xl" />
                        </button>
                    </div>

                    <Link to="/">
                        <div className='flex items-center gap-2 text-gray-800'>
                            <img src="/stitch.svg" alt="Stitch" className='h-[40px]' />
                            <p className="text-3xl font-bold">Stitch</p>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleSearchIcon}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none">
                            <BsSearch className="text-xl" />
                        </button>
                        {isLoggedIn && (
                            <Link to="/user/account" className="text-gray-600 hover:text-gray-900">
                                <CiUser className="text-2xl" />
                            </Link>
                        )}
                        {isLoggedIn && (
                            <Link to="/checkout/cart" className="text-gray-600 hover:text-gray-900 relative">
                                <PiShoppingCartSimpleLight className="text-2xl" />
                                {cart.totalItem > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {cart.totalItem}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.form
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSearch}
                            className="mt-4 w-11/12"
                        >
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onBlur={() => setIsSearchOpen(false)}
                                    ref={searchInputRef}
                                    className="w-full p-2 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <BsSearch className="text-gray-600" />
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

            {isSearchOpen && searchSuggestions.length > 0 && (
                <div className="flex justify-center">
                    <ul className="absolute w-5/6 border bg-white border-gray-300 shadow-lg rounded-md z-10">
                        {searchSuggestions.map((item, index) => {
                            const regex = new RegExp(`(${query})`, "i");
                            const parts = item.suggestion.split(regex);
                            const Icon = item.type === "history" ? History : TrendingUp;

                            return (
                                <li
                                    key={index}
                                    className="flex items-center justify-between gap-4 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer overflow-hidden"
                                    onMouseDown={() => handleSuggestionClick(item.suggestion)}
                                >
                                    <div className="flex items-center gap-4">
                                        <Icon className="w-4 h-4 text-gray-500" />
                                        <span>
                                            {parts.map((part, i) =>
                                                part.toLowerCase() === query.toLowerCase() ? (
                                                    <span key={i} className="text-gray-600">{part}</span>
                                                ) : (
                                                    <span key={i} className='font-semibold'>{part}</span>
                                                )
                                            )}
                                        </span>
                                    </div>
                                    {item.type === "history" && (
                                        <X
                                            className='w-4 h-4 text-gray-500'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(removeSearchHistory(query, item.id));
                                            }}
                                        />
                                    )}
                                </li>
                            );
                        })}

                        {searchSuggestions.some(item => item.type === "history") && (
                            <li
                                className="flex justify-center font-semibold bg-gray-100 text-gray-700 hover:underline py-2 cursor-pointer"
                                onClick={() => dispatch(clearSearchHistory())}
                            >
                                Clear all search history
                            </li>
                        )}
                    </ul>
                </div>
            )}

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        onClick={() => setSidebar(false)}
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5">
                                <button onClick={() => setSidebar(false)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                                    <IoMdClose className="text-2xl" />
                                </button>
                                <div className="mt-8 space-y-4">
                                    {isLoggedIn && decodeJWT(localStorage.getItem("jwtToken")).authorities?.includes("ROLE_ADMIN") ?
                                        adminNavlinks.map((link, index) => (
                                            <Link
                                                key={index}
                                                to={link.link}
                                                className="block text-gray-600 hover:text-gray-900 font-medium"
                                                onClick={() => setSidebar(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        )) :
                                        filteredNavlinks.map((link, index) => (
                                            <Link
                                                key={index}
                                                to={link.link}
                                                className="block text-gray-600 hover:text-gray-900 font-medium"
                                                onClick={() => setSidebar(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}

                                    {isLoggedIn && (
                                        <button
                                            onClick={handleLogOut}
                                            className="block text-gray-600 hover:text-gray-900 font-medium"
                                        >
                                            Log Out
                                        </button>
                                    )}
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;