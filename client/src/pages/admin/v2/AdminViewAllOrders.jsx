import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Package2, Search, Filter, ArrowUpDown, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import OrderCard2 from "../../../components/Admin/v2/OrderCard2"
import BASE_URL from "../../../utils/baseurl"
import decodeJWT from "../../../utils/decodeJWT"

const AdminViewAllOrders = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [sortBy, setSortBy] = useState("newest")
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

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
        setError(null)
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            })
            if (response.data) {
                setOrders(response.data)
                setFilteredOrders(response.data)
            } else {
                setError("No orders found")
                toast.error("Error fetching orders. Please try again.")
            }
        } catch (error) {
            setError("Failed to load orders")
            toast.error("Error fetching orders. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const refreshOrders = async () => {
        setRefreshing(true)
        await fetchOrders()
        setRefreshing(false)
    }

    const deleteOrder = async (id) => {
        // Optimistically update UI first
        setOrders(orders.filter((order) => order.id !== id))
        setFilteredOrders(filteredOrders.filter((order) => order.id !== id))

        try {
            await axios.delete(`${API_URL}${id}/delete`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            })
            toast.success("Order deleted successfully.")
        } catch (error) {
            // If deletion fails, refetch orders to restore the state
            toast.error("Error deleting order. Please try again.")
            fetchOrders()
        }
    }

    // Function to update order status in the local state
    const updateOrderStatus = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === orderId ? { ...order, orderStatus: newStatus } : order)),
        )
        setFilteredOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === orderId ? { ...order, orderStatus: newStatus } : order)),
        )
    }

    useEffect(() => {
        // Filter and sort orders whenever dependencies change
        let result = [...orders]

        // Apply status filter
        if (statusFilter !== "ALL") {
            result = result.filter((order) => order.orderStatus === statusFilter)
        }

        // Apply search filter
        if (searchTerm) {
            result = result.filter(
                (order) =>
                    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.orderItems.some((item) => item.product.title.toLowerCase().includes(searchTerm.toLowerCase())),
            )
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.orderDate) - new Date(a.orderDate)
            } else if (sortBy === "oldest") {
                return new Date(a.orderDate) - new Date(b.orderDate)
            } else if (sortBy === "highestPrice") {
                return b.totalDiscountedPrice - a.totalDiscountedPrice
            } else if (sortBy === "lowestPrice") {
                return a.totalDiscountedPrice - b.totalDiscountedPrice
            }
            return 0
        })

        setFilteredOrders(result)
    }, [orders, searchTerm, statusFilter, sortBy])

    const getStatusCounts = () => {
        const counts = {
            ALL: orders.length,
            PLACED: 0,
            CONFIRMED: 0,
            SHIPPED: 0,
            DELIVERED: 0,
            CANCELLED: 0,
        }

        orders.forEach((order) => {
            if (counts.hasOwnProperty(order.orderStatus)) {
                counts[order.orderStatus]++
            }
        })

        return counts
    }

    const statusCounts = getStatusCounts()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                            <Package2 className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Orders Management</h1>
                            <p className="text-gray-400 text-sm">Manage and track all customer orders</p>
                        </div>
                    </div>

                    <button
                        onClick={refreshOrders}
                        disabled={refreshing}
                        className="flex items-center px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-all"
                    >
                        {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Refresh
                    </button>
                </div>

                {/* Status Tabs */}
                <div className="mb-6 overflow-x-auto">
                    <div className="flex space-x-2 min-w-max">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status ? "bg-blue-600 text-white" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                                    }`}
                            >
                                {status} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by order ID or product name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="lowestPrice">Lowest Price</option>
                                <option value="highestPrice">Highest Price</option>
                            </select>
                            <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-400">Loading orders...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <p className="text-gray-300 font-medium">{error}</p>
                        <button
                            onClick={refreshOrders}
                            className="mt-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
                        <Package2 className="h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-gray-300 font-medium">No orders found</p>
                        <p className="text-gray-500 text-sm mt-1">Try changing your filters or search term</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredOrders.map((order) => (
                            <OrderCard2
                                key={order.id}
                                order={order}
                                deleteOrder={deleteOrder}
                                onStatusUpdate={updateOrderStatus}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminViewAllOrders