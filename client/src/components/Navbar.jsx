import { Link } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import decodeJWT from '../utils/decodeJWT';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../redux/customer/cart/cartActions';

const Navbar = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {

    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cartState);

    const [isSidebarOpen, setSidebar] = useState(false);
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getCart());
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const formattedInput = input.trim().replace(/\s+/g, '+');
            navigate(`/products/search?q=${formattedInput}`);
            setInput('');
            setIsSearchOpen(false);
        }
    };

    const handleLogOut = () => {
        try {
            const tokenKey = "jwtToken"
            localStorage.removeItem(tokenKey);
            setSidebar(false);
            navigate("/");
            toast.warn('Logged out successfully!');
        } catch (error) {
            console.log("Error:", error);
            toast.error('Error while logging out!');
        }
    }

    const navlinks = [
        { name: "Home", link: "/" },
        { name: "Orders", link: "/orders" },
        { name: "Cart", link: "/cart" },
        { name: "Wishlist", link: "/wishlist" },
        { name: "Help & Support", link: "/help" },
        { name: "Log In", link: "/login" },
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

    const adminNavlinks = [
        { name: "Home", link: "/" },
        { name: "Create Product", link: "/admin/products/create" },
        { name: "View Products", link: "/admin/products" },
        { name: "View Orders", link: "/admin/orders" },
        { name: "View Issues", link: "/admin/help" },
        { name: "View Users", link: "/admin/users" },
    ];

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setSidebar(true)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                            <FiMenu className="text-2xl" />
                        </button>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                        <Link to="/" className="text-3xl font-bold text-gray-800">Stitch</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                if (!isSearchOpen) {
                                    setTimeout(() => searchInputRef.current?.focus(), 0);
                                }
                            }}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none">
                            <BsSearch className="text-xl" />
                        </button>
                        {isLoggedIn && (
                            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                                <CiUser className="text-2xl" />
                            </Link>
                        )}
                        {isLoggedIn && (
                            <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
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
                            className="mt-4"
                        >
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    ref={searchInputRef}
                                    className="w-full p-2 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <BsSearch className="text-gray-400" />
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

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

                                    {/* {filteredNavlinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            to={link.link}
                                            className="block text-gray-600 hover:text-gray-900 font-medium"
                                            onClick={() => setSidebar(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))} */}
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