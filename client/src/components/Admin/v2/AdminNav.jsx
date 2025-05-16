import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Bell,
    Moon,
    Sun,
    LayoutDashboard,
    Activity,
    Database,
    BadgeHelp,
    MessageSquare,
    Settings,
} from "lucide-react"
import decodeJWT from "../../../utils/decodeJWT";

export default function AdminNav() {
    const [darkMode, setDarkMode] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeItem, setActiveItem] = useState("Dashboard")
    const navigate = useNavigate()

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle("dark")
    }

    const isLoggedIn = !!localStorage.getItem("jwtToken");

    // Menu items
    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, color: "text-cyan-400", link: "/admin" },
        { name: "Create Product", icon: Database, color: "text-slate-400", link: "/admin/products/create" },
        { name: "View Products", icon: MessageSquare, color: "text-slate-400", link: "/admin/products" },
        { name: "View Orders", icon: Activity, color: "text-slate-400", link: "/admin/orders" },
        { name: "View Issues", icon: BadgeHelp, color: "text-slate-400", link: "/admin/help" },
        { name: "View Users", icon: Settings, color: "text-slate-400", link: "/admin/users" },
    ]

    return (
        <>
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                STICH
                            </span>
                        </div>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search systems..."
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:text-slate-300 dark:placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <button className="relative p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:outline-none">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:outline-none"
                            >
                                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </button>

                            {/* User Avatar */}
                            <div className="relative">
                                <button className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                    <img src="/placeholder.svg?height=32&width=32" alt="User" className="h-full w-full object-cover" />
                                </button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar - Hidden on mobile unless menu is open */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 pt-16 transform transition-transform duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-700/50 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div className="h-full flex flex-col justify-between overflow-y-auto">
                    {/* Menu Items */}
                    <nav className="px-4 py-6 space-y-1">
                        {isLoggedIn && decodeJWT(localStorage.getItem("jwtToken")).authorities?.includes("ROLE_ADMIN") ?
                            menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.link}
                                    onClick={() => setActiveItem(item.name)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeItem === item.name
                                        ? "bg-slate-800/10 dark:bg-slate-800/70 text-cyan-500"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-slate-100"
                                        }`}
                                >
                                    <item.icon className={`mr-3 h-5 w-5 ${activeItem === item.name ? "text-cyan-500" : ""}`} />
                                    {item.name}
                                </Link>
                            )) :
                            navigate('/Log')
                        }
                    </nav>
                </div>
            </aside>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </>
    )
}

