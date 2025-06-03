import { useEffect, useState } from "react"
import axios from "axios"
import { X, ChevronRight, Search, Filter, ShoppingBag, Loader2, Star, Radio } from "lucide-react"
import BASE_URL from "../../../utils/baseurl";
import { toast } from 'react-hot-toast';

function ProductRecommendList({ userId }) {
    const [products, setProducts] = useState([])
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [fetchedOrders, setFetchedOrders] = useState([])
    const [isRecommending, setIsRecommending] = useState(false)

    useEffect(() => {
        const fetchOrdersAndRecommendations = async () => {
            setIsLoading(true)
            try {
                // Step 1: Fetch orders from the admin API
                console.log("Fetching orders...")
                const ordersResponse = await axios.get(`${BASE_URL}/api/admin/orders/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                })

                const fetchedOrdersData = ordersResponse.data || []
                setFetchedOrders(fetchedOrdersData)
                console.log("Fetched orders:", fetchedOrdersData)

                if (fetchedOrdersData.length === 0) {
                    console.log("No orders found")
                    setProducts([])
                    setIsLoading(false)
                    return
                }

                // Step 2: Extract unique product IDs from orders
                const uniqueProductIds = new Set()
                fetchedOrdersData.forEach((order) => {
                    if (order.orderItems && Array.isArray(order.orderItems)) {
                        order.orderItems.forEach((item) => {
                            if (item.product && item.product.id) {
                                uniqueProductIds.add(item.product.id)
                            }
                        })
                    }
                })

                const productIdsArray = Array.from(uniqueProductIds)
                console.log("Unique product IDs from orders:", productIdsArray)

                if (productIdsArray.length === 0) {
                    console.log("No products found in orders")
                    setProducts([])
                    setIsLoading(false)
                    return
                }

                // Step 3: Get ML recommendations for each product ID
                // const allRecommendedIds = new Set()

                // for (const productId of productIdsArray) {
                //   try {
                //     const mlResponse = await axios.post("http://localhost:5454/api/ml/recommend/ids", {
                //       productId: productId,
                //       limit: 3,
                //     })

                //     console.log(`ML recommendations for product ${productId}:`, mlResponse.data)

                //     // Add recommended IDs to the set (automatically handles duplicates)
                //     mlResponse.data.forEach((id) => allRecommendedIds.add(id))
                //   } catch (error) {
                //     console.error(`Error getting ML recommendations for product ${productId}:`, error)
                //   }
                // }

                const recommendedIdsArray = Array.from(uniqueProductIds)
                console.log("All unique recommended product IDs:", recommendedIdsArray)

                // Step 4: Fetch full product details for each recommended product ID
                const productPromises = recommendedIdsArray.map(async (productId) => {
                    try {
                        const productResponse = await axios.get(`${BASE_URL}/api/products/${productId}`)
                        return productResponse.data
                    } catch (error) {
                        console.error(`Error fetching product details for ID ${productId}:`, error)
                        return null
                    }
                })

                const recommendedProducts = await Promise.all(productPromises)

                // Filter out null values (failed requests)
                const validProducts = recommendedProducts.filter((product) => product !== null)

                console.log("Fetched recommended products:", validProducts)
                setProducts(validProducts)
            } catch (error) {
                console.error("Error in fetchOrdersAndRecommendations:", error)
                setProducts([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrdersAndRecommendations()
    }, [])

    const selectProduct = (productId) => {
        console.log("Selecting product ID:", productId)
        setSelectedProductId(productId === selectedProductId ? null : productId)
    }

    const handleRecommend = async () => {
        if (!selectedProductId) {
            toast.error("Please select a product first!")
            return
        }

        setIsRecommending(true)
        try {
            const response = await axios.post(`${BASE_URL}/api/ml/recommend?userId=${userId}`, {
                productId: selectedProductId,
                limit: 10,
            })

            console.log("ML recommendation response:", response.data)
            toast.success("Product recommendation generated successfully!")
            setShowModal(false)
            setSelectedProductId(null)
        } catch (error) {
            console.error("Error generating recommendation:", error)
            toast.error("Failed to generate recommendation. Please try again.")
        } finally {
            setIsRecommending(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price)
    }

    const getDiscountPercentage = (product) => {
        return product.discountPercent || 0
    }

    const getCategoryPath = (category) => {
        if (!category) return ""
        const path = []
        let current = category

        while (current) {
            path.unshift(current.name)
            current = current.parentCategory || null
        }

        return path.join(" › ")
    }

    const getTotalStock = (product) => {
        if (product.sizes && product.sizes.length > 0) {
            return product.sizes.reduce((total, size) => total + (size.quantity || 0), 0)
        }
        return product.quantity || 0
    }

    const renderProduct = (product) => {
        const totalStock = getTotalStock(product)
        const categoryPath = getCategoryPath(product.category)
        const isSelected = selectedProductId === product.id
        const discountPercent = getDiscountPercentage(product)

        return (
            <div
                key={product.id}
                className={`bg-slate-800/60 border rounded-lg mb-3 overflow-hidden transition-all cursor-pointer ${isSelected ? "border-green-500/60 bg-green-500/10" : "border-slate-700/40 hover:border-slate-600/60"
                    }`}
                onClick={() => selectProduct(product.id)}
            >
                {/* Mobile View */}
                <div className="md:hidden p-3 space-y-3">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-slate-800 mr-3">
                            <img
                                src={product.preview || "/placeholder.svg?height=64&width=64"}
                                alt={product.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "/placeholder.svg?height=64&width=64"
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-slate-200 truncate">{product.title}</h3>
                            <p className="text-xs text-slate-400 mb-1">{product.brand}</p>
                            {categoryPath && <p className="text-xs text-slate-500 truncate">{categoryPath}</p>}

                            {/* Price */}
                            <div className="flex items-center mt-1">
                                <span className="text-sm font-bold text-slate-200">{formatPrice(product.discountedPrice)}</span>
                                {discountPercent > 0 && (
                                    <>
                                        <span className="text-xs line-through text-slate-400 ml-2">{formatPrice(product.price)}</span>
                                        <span className="text-xs bg-green-500/20 text-green-400 px-1 py-0.5 rounded ml-2">
                                            -{discountPercent}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Rating */}
                            {product.totalReviews > 0 && (
                                <div className="flex items-center mt-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-slate-400 ml-1">
                                        {product.averageRating.toFixed(1)} ({product.totalReviews})
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="ml-2">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"
                                    }`}
                            >
                                <Radio className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    {/* Stock and Sizes */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Stock:</span>
                            <span className={`font-medium ${totalStock > 0 ? "text-green-400" : "text-red-400"}`}>
                                {totalStock > 0 ? `${totalStock} units` : "Out of stock"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-11 gap-4 items-center p-3">
                    <div className="col-span-1 flex justify-center">
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"
                                }`}
                        >
                            <Radio className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-800">
                            <img
                                src={product.preview || "/placeholder.svg?height=48&width=48"}
                                alt={product.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = "/placeholder.svg?height=48&width=48"
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-span-3 min-w-0">
                        <h3 className="text-sm font-medium text-slate-200 truncate">{product.title}</h3>
                        <div className="flex items-center space-x-2">
                            <p className="text-xs text-slate-400">{product.brand}</p>
                            <span className="text-xs text-slate-500">•</span>
                            <p className="text-xs text-slate-500">{product.color}</p>
                        </div>
                        {categoryPath && <p className="text-xs text-slate-500 truncate mt-0.5">{categoryPath}</p>}
                    </div>

                    <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-slate-200">{formatPrice(product.discountedPrice)}</span>
                            {discountPercent > 0 && (
                                <span className="text-xs line-through text-slate-400">{formatPrice(product.price)}</span>
                            )}
                        </div>
                        {/* {product.totalReviews > 0 && (
                            <div className="flex items-center mt-0.5">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-slate-400 ml-1">
                                    {product.averageRating.toFixed(1)} ({product.totalReviews})
                                </span>
                            </div>
                        )} */}
                    </div>

                    <div className="col-span-2">
                        {discountPercent > 0 ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                                -{discountPercent}% OFF
                            </span>
                        ) : (
                            <span className="text-xs text-slate-500">No discount</span>
                        )}
                    </div>

                    <div className="col-span-2">
                        <div className="flex items-center mb-1">
                            <div
                                className={`h-2 w-2 rounded-full mr-2 ${totalStock > 10 ? "bg-green-400" : totalStock > 0 ? "bg-yellow-400" : "bg-red-400"
                                    }`}
                            ></div>
                            <span className="text-xs font-medium text-slate-300">
                                {totalStock > 0 ? `${totalStock} units` : "Out of stock"}
                            </span>
                        </div>


                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-1/2 h-full p-6 bg-slate-900 rounded-lg shadow-lg border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-slate-200 font-semibold">ML Recommended Products</h3>
                {selectedProductId && (
                    <button
                        onClick={handleRecommend}
                        disabled={isRecommending}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white transition-colors flex items-center"
                    >
                        {isRecommending ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                Generating...
                            </>
                        ) : (
                            "Generate Recommendations"
                        )}
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64">
                    <Loader2 className="animate-spin h-8 w-8 text-green-500 mb-4" />
                    <p className="text-slate-400 text-sm">Loading products from order history...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                    <p className="mb-2">No products available for ML recommendations</p>
                    <p className="text-xs text-slate-500">
                        {fetchedOrders.length === 0 ? "No order history found" : "Unable to load products from order history"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <p className="text-xs text-slate-500">
                            Based on {fetchedOrders.length} order{fetchedOrders.length !== 1 ? "s" : ""} • {products.length} products
                            available • Select one product to generate recommendations
                        </p>
                    </div>

                    <div className="space-y-2">{products.slice(0, 6).map(renderProduct)}</div>

                    {products.length > 6 && (
                        <button
                            className="mt-6 w-full px-4 py-3 text-sm font-medium rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700/30 transition-colors flex items-center justify-center"
                            onClick={() => setShowModal(true)}
                        >
                            See More Products
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </button>
                    )}
                </>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-slate-800 p-6 border-b border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <ShoppingBag className="h-5 w-5 text-green-400" />
                                    <h4 className="text-slate-200 font-bold text-xl">Select Product for ML Recommendations</h4>
                                </div>
                                <button
                                    className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-full"
                                    onClick={() => setShowModal(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-4 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                                />
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer">
                                    <Filter className="h-3 w-3 mr-1" />
                                    All Categories
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer">
                                    In Stock
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer">
                                    With Discount
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-3">{products.map(renderProduct)}</div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-800 p-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedProductId ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"
                                        }`}
                                >
                                    <Radio className="h-4 w-4" />
                                </div>
                                <div className="text-sm text-slate-300">
                                    {selectedProductId ? (
                                        <>
                                            <span className="font-medium">1</span> product selected for recommendations
                                        </>
                                    ) : (
                                        "No product selected"
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    className="px-4 py-2 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-6 py-2 font-semibold rounded-md flex items-center ${selectedProductId
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                                        } transition-colors`}
                                    onClick={handleRecommend}
                                    disabled={!selectedProductId || isRecommending}
                                >
                                    {isRecommending ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Recommendations"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductRecommendList
