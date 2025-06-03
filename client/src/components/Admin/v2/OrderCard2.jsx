import { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { format } from "date-fns"
import {
    CheckCircle2,
    Truck,
    Package,
    XCircle,
    Clock,
    ChevronRight,
    ChevronDown,
    Save,
    Trash2,
    User,
    DollarSign,
    ShoppingBag,
    MapPin,
    CreditCard,
    ShoppingCart,
} from "lucide-react"
import BASE_URL from "../../../utils/baseurl"

const OrderCard2 = ({ order, deleteOrder, onStatusUpdate }) => {
    const initialStatus = order.orderStatus
    const [tempStatus, setTempStatus] = useState(initialStatus)
    const [isSaveEnabled, setIsSaveEnabled] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    // Each card now manages its own expanded state
    const [isExpanded, setIsExpanded] = useState(false)

    const API_URL = `${BASE_URL}/api/admin/orders/`

    const statusUrl = {
        CONFIRMED: "confirmed",
        SHIPPED: "ship",
        DELIVERED: "deliver",
        CANCELLED: "cancel",
    }

    // Updated status flow to include PLACED
    const statusFlow = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]

    const handleStatusToggle = () => {
        const currentIndex = statusFlow.indexOf(tempStatus)
        const nextIndex = (currentIndex + 1) % statusFlow.length
        const nextStatus = statusFlow[nextIndex]

        setTempStatus(nextStatus)
        setIsSaveEnabled(nextStatus !== initialStatus)
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const saveStatus = async () => {
        setIsSaving(true)
        try {
            // Skip if trying to set to PLACED as there's likely no endpoint for that
            if (tempStatus === "PLACED") {
                toast.error("Cannot set status to PLACED. Please choose another status.")
                setIsSaving(false)
                return
            }

            const response = await axios.put(
                `${API_URL}${order.id}/${statusUrl[tempStatus]}`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
                },
            )

            if (response.data) {
                toast.success(`Order status updated to ${tempStatus}.`)
                setIsSaveEnabled(false)
                // Update the parent component's state
                if (onStatusUpdate) {
                    onStatusUpdate(order.id, tempStatus)
                }
            }
        } catch (error) {
            toast.error("Error updating order status. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "PLACED":
                return <ShoppingCart className="h-5 w-5 text-yellow-400" />
            case "CONFIRMED":
                return <CheckCircle2 className="h-5 w-5 text-blue-400" />
            case "SHIPPED":
                return <Truck className="h-5 w-5 text-purple-400" />
            case "DELIVERED":
                return <Package className="h-5 w-5 text-green-400" />
            case "CANCELLED":
                return <XCircle className="h-5 w-5 text-red-400" />
            default:
                return <Clock className="h-5 w-5 text-gray-400" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "PLACED":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            case "CONFIRMED":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "SHIPPED":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20"
            case "DELIVERED":
                return "bg-green-500/10 text-green-500 border-green-500/20"
            case "CANCELLED":
                return "bg-red-500/10 text-red-500 border-red-500/20"
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20"
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Not available"
        try {
            return format(new Date(dateString), "dd MMM yyyy, HH:mm")
        } catch (error) {
            return "Invalid date"
        }
    }

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-500/10 text-green-500"
            case "PENDING":
                return "bg-yellow-500/10 text-yellow-500"
            case "FAILED":
                return "bg-red-500/10 text-red-500"
            default:
                return "bg-gray-500/10 text-gray-500"
        }
    }

    // Calculate discount percentage
    const discountPercentage = order.discount > 0 ? Math.round((order.discount / order.totalPrice) * 100) : 0

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-900/10 hover:border-gray-600/50 flex flex-col">
            <div className="p-5 flex-1">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center">
                            <h3 className="text-lg font-bold text-white">{order.orderId}</h3>
                            <div className={`ml-3 px-2 py-1 rounded text-xs font-medium ${getStatusColor(tempStatus)}`}>
                                {tempStatus}
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{formatDate(order.orderDate)}</p>
                    </div>

                    <button
                        onClick={handleStatusToggle}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors"
                    >
                        {getStatusIcon(tempStatus)}
                        <span className="text-xs font-medium ml-1">Change Status</span>
                    </button>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-400">User ID: {order.userId}</span>
                    </div>
                    <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-400">Items: {order.totalItem}</span>
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-400">
                            ₹{order.totalDiscountedPrice.toFixed(2)}
                            {discountPercentage > 0 && <span className="ml-1 text-green-500 text-xs">(-{discountPercentage}%)</span>}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-400">
                            {order.paymentDetails?.paymentMethod || "N/A"}
                            {order.paymentDetails?.status && (
                                <span
                                    className={`ml-2 px-1.5 py-0.5 rounded text-xs ${getPaymentStatusColor(order.paymentDetails.status)}`}
                                >
                                    {order.paymentDetails.status}
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Order Items</h4>
                        <button
                            onClick={toggleExpand}
                            className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                        >
                            {isExpanded ? "Show Less" : "Show All"}
                            {isExpanded ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                        </button>
                    </div>

                    <div className={`space-y-2 ${isExpanded ? "" : "max-h-24 overflow-hidden"}`}>
                        {order.orderItems.map((item, idx) => (
                            <div
                                key={`${order.id}-item-${idx}`}
                                className="flex items-center py-1 border-b border-gray-700/50 last:border-0"
                            >
                                <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                                    {item.product.preview ? (
                                        <img
                                            src={item.product.preview || "/placeholder.svg"}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-medium text-gray-300">{idx + 1}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-300 truncate">{item.product.title}</p>
                                    <div className="flex items-center mt-1">
                                        <span className="text-xs text-gray-500">Size: {item.size || item.product.size || "N/A"}</span>
                                        <span className="mx-2 text-gray-600">•</span>
                                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                        <span className="mx-2 text-gray-600">•</span>
                                        <span className="text-xs text-gray-500">
                                            ₹{item.product.discountedPrice.toFixed(2)}
                                            {item.product.discountPercent > 0 && (
                                                <span className="ml-1 text-green-500">(-{item.product.discountPercent}%)</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Address (only shown when expanded) */}
                {isExpanded && order.address && (
                    <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center mb-2">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <h4 className="text-sm font-medium text-gray-300">Shipping Address</h4>
                        </div>
                        <p className="text-sm text-gray-400 ml-6">
                            {order.address.streetAddress}, {order.address.city}, {order.address.state} - {order.address.zipCode}
                        </p>
                        <p className="text-sm text-gray-400 ml-6 mt-1">Phone: {order.address.mobile}</p>
                    </div>
                )}

                {/* Payment Details (only shown when expanded) */}
                {isExpanded && order.paymentDetails && (
                    <div className="mt-3 p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center mb-2">
                            <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                            <h4 className="text-sm font-medium text-gray-300">Payment Details</h4>
                        </div>
                        <div className="ml-6 space-y-1">
                            <p className="text-sm text-gray-400">Method: {order.paymentDetails.paymentMethod}</p>
                            <p className="text-sm text-gray-400">ID: {order.paymentDetails.paymentId || "N/A"}</p>
                            {order.razorpayOrderId && (
                                <p className="text-sm text-gray-400">Razorpay Order: {order.razorpayOrderId}</p>
                            )}
                            <p className="text-sm text-gray-400">Date: {formatDate(order.paymentDetails.paymentDate)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons - Fixed at the bottom */}
            <div className="flex border-t border-gray-700/50 mt-auto">
                <button
                    onClick={saveStatus}
                    disabled={!isSaveEnabled || isSaving}
                    className={`flex-1 py-3 flex items-center justify-center text-sm font-medium transition-colors ${isSaveEnabled
                        ? "text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        : "text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {isSaving ? (
                        <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Status
                        </>
                    )}
                </button>

                <div className="w-px bg-gray-700/50"></div>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        deleteOrder(order.id)
                    }}
                    className="flex-1 py-3 flex items-center justify-center text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Order
                </button>
            </div>
        </div>
    )
}

export default OrderCard2