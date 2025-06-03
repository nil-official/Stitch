import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LucideListOrdered, Users, Loader2 } from 'lucide-react';
import BASE_URL from "../../../utils/baseurl";
import decodeJWT from "../../../utils/decodeJWT";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const orderData = {
//     daily: [
//         { name: "Mon", orders: 400 },
//         { name: "Tue", orders: 600 },
//         { name: "Wed", orders: 500 },
//         { name: "Thu", orders: 700 },
//         { name: "Fri", orders: 900 },
//         { name: "Sat", orders: 300 },
//         { name: "Sun", orders: 500 },
//     ],
//     weekly: [
//         { name: "Week 1", orders: 3000 },
//         { name: "Week 2", orders: 4000 },
//         { name: "Week 3", orders: 3500 },
//         { name: "Week 4", orders: 5000 },
//     ],
//     monthly: [
//         { name: "Jan", orders: 9000 },
//         { name: "Feb", orders: 14000 },
//         { name: "Mar", orders: 11000 },
//         { name: "Apr", orders: 15000 },
//         { name: "May", orders: 8000 },
//         { name: "Jun", orders: 5500 },
//         { name: "Jul", orders: 9000 },
//         { name: "Aug", orders: 7000 },
//         { name: "Sep", orders: 15000 },
//         { name: "Oct", orders: 13000 },
//         { name: "Nov", orders: 10000 },
//         { name: "Dec", orders: 8000 },
//     ],
// };



const recentOrders = [
    { id: 1, user: "Alice", amount: "$120.00", status: "Completed" },
    { id: 2, user: "Bob", amount: "$85.50", status: "Pending" },
    { id: 3, user: "Charlie", amount: "$230.00", status: "Completed" },
    { id: 4, user: "Dave", amount: "$50.00", status: "Failed" },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("daily");
    const [orderData, setOrderData] = useState({})
    const [recentOrders, setRecentOrders] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const API_URL = `${BASE_URL}/api/admin/orders/`

    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities
            if (!authorities.includes("ROLE_ADMIN")) {
                navigate("/login")
            }
        } else {
            navigate("/login")
        }
    }, [navigate])

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(API_URL + "analytics", {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            })
            if (response.data) {
                setOrderData(response.data)
            } else {
                toast.error("Error fetching orders. Please try again.")
            }
        } catch (error) {
            toast.error("Error fetching orders. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchRecentOrders = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(API_URL + "recent", {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            })
            if (response.data) {
                setRecentOrders(response.data)
                console.log(recentOrders)
            } else {
                toast.error("Error fetching orders. Please try again.")
            }
        } catch (error) {
            toast.error("Error fetching orders. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
        fetchRecentOrders()
        console.log(recentOrders)
    }, [])

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 p-2 rounded-md border border-slate-700 text-slate-100 text-xs">
                    <p className="font-medium">{`${label}`}</p>
                    <p className="text-cyan-400">{`Orders: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100">
            <div >
                <main className="transition-all duration-300 ease-in-out">
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center mb-6">
                            <LucideListOrdered className="mr-2 h-6 w-6 text-cyan-500" />
                            <h1 className="text-2xl font-bold">Orders Overview</h1>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold text-slate-300">Total Users</h3>
                                    <Users className="h-5 w-5" />
                                </div>

                                <p className="text-2xl font-bold text-cyan-400">1,234</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                                <h3 className="text-lg font-semibold text-slate-300">Total Revenue</h3>
                                <p className="text-2xl font-bold text-cyan-400">₹45,678</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                                <h3 className="text-lg font-semibold text-slate-300">Orders</h3>
                                <p className="text-2xl font-bold text-cyan-400">8,456</p>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                            <div className="flex space-x-4 mb-4">
                                {["daily", "weekly", "monthly"].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab
                                            ? "bg-slate-900 text-cyan-400 border border-cyan-500/30"
                                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                            }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            {
                                isLoading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
                                        <span className="ml-2 text-slate-400">Loading users...</span>
                                    </div>
                                ) : <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={orderData[activeTab]}>
                                            <XAxis
                                                dataKey="name"
                                                stroke="#94a3b8"
                                                tick={{ fill: '#94a3b8' }}
                                                axisLine={{ stroke: '#334155' }}
                                                tickLine={{ stroke: '#334155' }}
                                            />
                                            <YAxis
                                                stroke="#94a3b8"
                                                tick={{ fill: '#94a3b8' }}
                                                axisLine={{ stroke: '#334155' }}
                                                tickLine={{ stroke: '#334155' }}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={false} />
                                            <Bar
                                                dataKey="orders"
                                                fill="#06b6d4"
                                                radius={[10, 10, 0, 0]}
                                                barSize={activeTab === "monthly" ? 40 : activeTab === "weekly" ? 60 : 50}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            }
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-300">Recent Orders</h3>
                                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">View All</button>
                            </div>

                            <div className="space-y-3">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 hover:border-slate-500/50 transition-colors"
                                        >
                                            {/* Order Header */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-sm font-medium text-slate-200">{order.orderId}</div>
                                                    <div className="text-xs text-slate-400">User ID: {order.userId}</div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.orderStatus === "PLACED"
                                                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                            : order.orderStatus === "CONFIRMED"
                                                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                                : order.orderStatus === "SHIPPED"
                                                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                                    : order.orderStatus === "DELIVERED"
                                                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                                        : order.orderStatus === "CANCELLED"
                                                                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                                                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                            }`}
                                                    >
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Items Preview */}
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="flex -space-x-2">
                                                    {order.orderItems.slice(0, 3).map((item, index) => (
                                                        <div
                                                            key={item.id}
                                                            className="w-8 h-8 rounded-md overflow-hidden border-2 border-slate-700 bg-slate-800"
                                                            style={{ zIndex: 10 - index }}
                                                        >
                                                            <img
                                                                src={item.product.preview || "/placeholder.svg?height=32&width=32"}
                                                                alt={item.product.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null
                                                                    e.target.src = "/placeholder.svg?height=32&width=32"
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                    {order.orderItems.length > 3 && (
                                                        <div className="w-8 h-8 rounded-md bg-slate-600 border-2 border-slate-700 flex items-center justify-center">
                                                            <span className="text-xs text-slate-300 font-medium">+{order.orderItems.length - 3}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-slate-300">
                                                        {order.totalItem} {order.totalItem === 1 ? "item" : "items"}
                                                    </div>
                                                    <div className="text-xs text-slate-400 truncate">
                                                        {order.orderItems[0].product.title}
                                                        {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Details */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                                <div>
                                                    <span className="text-slate-400">Total:</span>
                                                    <div className="font-medium text-slate-200">₹{order.totalDiscountedPrice.toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Saved:</span>
                                                    <div className="font-medium text-green-400">₹{order.discount.toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Payment:</span>
                                                    <div className="font-medium text-slate-200">{order.paymentDetails.paymentMethod}</div>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Date:</span>
                                                    <div className="font-medium text-slate-200">
                                                        {new Date(order.orderDate).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="mt-2 pt-2 border-t border-slate-600/30">
                                                <div className="text-xs text-slate-400">
                                                    <span className="inline-flex items-center">
                                                        📍 {order.address.city}, {order.address.state}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <div className="mb-2">No recent orders found</div>
                                        <div className="text-xs">Recent orders will appear here</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
