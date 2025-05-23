import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Activity, Plus, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast';
import ProductRow_v2 from "../../../components/Admin/v2/ProductRow_v2"
import decodeJWT from "../../../utils/decodeJWT";
import BASE_URL from "../../../utils/baseurl";
import { AUTH_ROUTES } from "../../../routes/routePaths";

const AdminViewProducts = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    // Pagination state
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const API_URL = `${BASE_URL}/api/admin/products/all?pageNumber=${pageNumber}&pageSize=${pageSize}`

    // Verify admin access
    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities
            if (!authorities.includes("ROLE_ADMIN")) {
                navigate(AUTH_ROUTES.LOGIN)
            }
        } else {
            navigate(AUTH_ROUTES.LOGIN)
        }
    }, [navigate])

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            })
            setProducts(response.data?.content || [])
            // console.log(products);
        } catch (error) {
            console.error("Error fetching products:", error)
            toast.error("Error fetching products. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [pageNumber, pageSize])

    const editProduct = (id) => {
        const product = products.find((product) => product.id === id)
        navigate("/admin/products/edit", { state: { product } })
    }

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((product) => product.id !== id))
            axios
                .delete(`${BASE_URL}/api/admin/products/${id}/delete`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                })
                .then(() => toast.success("Product deleted successfully."))
                .catch((error) => {
                    console.error("Error deleting product:", error)
                    toast.error("Error deleting product. Please try again.")
                    // Refetch products to restore the deleted product if deletion failed
                    fetchProducts()
                })
        }
    }

    const handleNextPage = () => {
        if (products.length < pageSize) return
        setPageNumber(prevPage => prevPage + 1)
    }

    const handlePrevPage = () => {
        setPageNumber(prevPage => Math.max(prevPage - 1, 0))
    }

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <Activity className="mr-2 h-6 w-6 text-cyan-500" />
                <h1 className="text-2xl font-bold">Products Management</h1>
                <div className="ml-auto flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></span>
                        {products.length} PRODUCTS
                    </span>
                    <button
                        onClick={() => navigate("/admin/products/create")}
                        className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-800/50 text-cyan-400 hover:bg-slate-700 border border-cyan-500/30"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300 placeholder:text-slate-500"
                        />
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                        <span>Showing {filteredProducts.length} of {products.length} products</span>
                        <span className="mx-2">|</span>
                        <span>Page {pageNumber + 1}</span>
                    </div>
                </div>
            </div>

            {/* Products List */}
            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
                        <span className="ml-2 text-slate-400">Loading products...</span>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="space-y-4">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-400 border-b border-slate-700/50">
                            <div className="col-span-1">Image</div>
                            <div className="col-span-3">Product</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-1">Price</div>
                            <div className="col-span-1">Discount</div>
                            <div className="col-span-2">Stock</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                        {filteredProducts.map((product) => (
                            <ProductRow_v2
                                key={product.id}
                                product={product}
                                onEdit={() => editProduct(product.id)}
                                onDelete={() => deleteProduct(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <button
                    onClick={handlePrevPage}
                    disabled={pageNumber === 0}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700/50 disabled:opacity-50 disabled:pointer-events-none"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={products.length < pageSize}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700/50 disabled:opacity-50 disabled:pointer-events-none"
                >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default AdminViewProducts