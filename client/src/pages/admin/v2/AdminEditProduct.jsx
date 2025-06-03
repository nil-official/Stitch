import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from 'react-hot-toast';
import axios from "axios"
import { PencilLine, ArrowLeft, ImageIcon, X, Loader2, Check, AlertCircle, Plus } from "lucide-react"
import BASE_URL from "../../../utils/baseurl";
import decodeJWT from "../../../utils/decodeJWT";
import { AUTH_ROUTES } from "../../../routes/routePaths";

const AdminEditProduct = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { product } = location.state || {}
    console.log(product)
    const [id, setId] = useState(0)

    // State variables for the form fields
    const [preview, setPreview] = useState("")
    const [images, setImages] = useState([""])
    const [brand, setBrand] = useState("")
    const [title, setTitle] = useState("")
    const [color, setColor] = useState("")
    const [price, setPrice] = useState(0)
    const [discountedPrice, setDiscountedPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [topLevelCategory, setTopLevelCategory] = useState("")
    const [secondLevelCategory, setSecondLevelCategory] = useState("")
    const [thirdLevelCategory, setThirdLevelCategory] = useState("")
    const [size, setSize] = useState([
        { name: "XS", quantity: 0 },
        { name: "S", quantity: 0 },
        { name: "M", quantity: 0 },
        { name: "L", quantity: 0 },
        { name: "XL", quantity: 0 },
        { name: "XXL", quantity: 0 },
        { name: "28", quantity: 0 },
        { name: "30", quantity: 0 },
        { name: "32", quantity: 0 },
        { name: "34", quantity: 0 },
        { name: "36", quantity: 0 },
        { name: "38", quantity: 0 },
        { name: "40", quantity: 0 },
    ])

    useEffect(() => {
        const upperBody = ["Shirt", "Tshirt", "Sweater", "Sweatshirt", "Jacket"]
        const lowerBody = ["Trouser", "Jean", "Short"]

        if (upperBody.includes(thirdLevelCategory)) {
            setSize([
                { name: "XS", quantity: 0 },
                { name: "S", quantity: 0 },
                { name: "M", quantity: 0 },
                { name: "L", quantity: 0 },
                { name: "XL", quantity: 0 },
                { name: "XXL", quantity: 0 },
            ])
        } else if (lowerBody.includes(thirdLevelCategory)) {
            setSize([
                { name: "28", quantity: 0 },
                { name: "30", quantity: 0 },
                { name: "32", quantity: 0 },
                { name: "34", quantity: 0 },
                { name: "36", quantity: 0 },
                { name: "38", quantity: 0 },
                { name: "40", quantity: 0 },
            ])
        }
    }, [thirdLevelCategory])

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})
    const [showPreview, setShowPreview] = useState(false)

    // Function to handle size input fields
    const handleSizeInputChange = (index, field, value) => {
        const newSize = [...size]
        newSize[index][field] = field === "quantity" ? Number(value) : value
        setSize(newSize)
    }

    // Function to handle additional images
    const handleImageChange = (index, value) => {
        const newImages = [...images]
        newImages[index] = value
        setImages(newImages)
    }

    // Function to add a new image field
    const addImageField = () => {
        setImages([...images, ""])
    }

    // Function to remove an image field
    const removeImageField = (index) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
    }

    // Function to validate form fields
    const validateInputs = () => {
        const newErrors = {}

        if (!title.trim()) newErrors.title = "Title is required"
        if (!brand.trim()) newErrors.brand = "Brand is required"
        if (!color.trim()) newErrors.color = "Color is required"
        if (!preview.trim()) newErrors.preview = "Main image is required"
        if (!price || price <= 0) newErrors.price = "Valid price is required"
        if (!discountedPrice || discountedPrice <= 0) newErrors.discountedPrice = "Valid discounted price is required"
        if (discountedPrice > price) newErrors.discountedPrice = "Discounted price cannot be higher than regular price"
        if (!topLevelCategory) newErrors.topLevelCategory = "Top level category is required"
        if (!secondLevelCategory) newErrors.secondLevelCategory = "Second level category is required"
        if (!thirdLevelCategory) newErrors.thirdLevelCategory = "Third level category is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateInputs()) {
            toast.error("Please fix the errors in the form")
            return
        }

        setIsSubmitting(true)

        // Filter out empty image URLs
        const filteredImages = images.filter((img) => img.trim() !== "")

        const productObj = {
            title,
            brand,
            description,
            color,
            price: Number(price),
            discountedPrice: Number(discountedPrice),
            sizes: size.filter((s) => s.quantity > 0),
            preview,
            images: filteredImages,
            topLevelCategory,
            secondLevelCategory,
            thirdLevelCategory,
        }

        try {
            const res = await axios.put(`${BASE_URL}/api/admin/products/${id}/update`, productObj, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            })
            if (res.data.error) {
                toast.error(res.data.error)
            } else {
                toast.success("Product updated successfully")
                navigate("/admin/products")
            }
        } catch (error) {
            console.error("Error updating product:", error)
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Check if the user is an admin and load product data
    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities
            if (authorities.includes("ROLE_ADMIN")) {
                if (product) {
                    setId(product.id)

                    // Extract category information
                    const thirdLevelCategory = product.category?.name || ""
                    const secondLevelCategory = product.category?.parentCategory?.name || ""
                    const topLevelCategory = product.category?.parentCategory?.parentCategory?.name || ""

                    // Set form fields with product data
                    setPreview(product.imageUrl || product.preview || "")
                    setImages(product.images?.length ? product.images : [""])
                    setBrand(product.brand || "")
                    setTitle(product.title || "")
                    setColor(product.color || "")
                    setPrice(product.price || 0)
                    setDiscountedPrice(product.discountedPrice || 0)
                    setDescription(product.description || "")
                    setTopLevelCategory(topLevelCategory)
                    setSecondLevelCategory(secondLevelCategory)
                    setThirdLevelCategory(thirdLevelCategory)
                    setSize(product.sizes)
                    console.log(thirdLevelCategory)

                    // Update size quantities
                    if (product.sizes && product.sizes.length > 0) {
                        size.forEach((s, index) => {
                            const sizeObj = product.sizes.find((size) => size.name === s.name)
                            if (sizeObj) {
                                handleSizeInputChange(index, "quantity", sizeObj.quantity)
                            }
                        })
                    }
                } else {
                    // No product data provided, redirect back to products list
                    toast.error("No product data found")
                    navigate("/admin/products")
                }
            } else {
                navigate(AUTH_ROUTES.LOGIN)
            }
        } else {
            navigate(AUTH_ROUTES.LOGIN)
        }
    }, [navigate, product])

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <PencilLine className="mr-2 h-6 w-6 text-cyan-500" />
                <h1 className="text-2xl font-bold">Edit Product</h1>
                <div className="ml-auto">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700/50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Image Preview */}
                    <div className="md:col-span-1 bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center justify-center h-full">
                            {preview ? (
                                <div className="w-full h-64 overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={preview || "/placeholder.svg"}
                                        alt="Product Preview"
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-64 flex items-center justify-center bg-slate-900/50 rounded-lg mb-4 border border-dashed border-slate-700">
                                    <ImageIcon className="h-16 w-16 text-slate-600" />
                                </div>
                            )}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Main Image URL (Preview)</label>
                                <input
                                    type="text"
                                    value={preview}
                                    onChange={(e) => setPreview(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.preview ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                    placeholder="Enter image URL"
                                />
                                {errors.preview && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.preview}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Form Fields */}
                    <div className="md:col-span-2 bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Brand</label>
                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.brand ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                    placeholder="Brand name"
                                />
                                {errors.brand && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.brand}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.title ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                    placeholder="Product title"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.price ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Discounted Price</label>
                                <input
                                    type="number"
                                    value={discountedPrice}
                                    onChange={(e) => setDiscountedPrice(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.discountedPrice ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                    placeholder="0.00"
                                />
                                {errors.discountedPrice && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.discountedPrice}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Color</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.color ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                    placeholder="Color"
                                />
                                {errors.color && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.color}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Product description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Top Level Category</label>
                                <input
                                    type="text"
                                    value={topLevelCategory}
                                    onChange={(e) => setTopLevelCategory(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.topLevelCategory ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                    placeholder="Category (e.g. Men, Women)"
                                />
                                {errors.topLevelCategory && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.topLevelCategory}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Second Level Category</label>
                                <input
                                    type="text"
                                    value={secondLevelCategory}
                                    onChange={(e) => setSecondLevelCategory(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.secondLevelCategory ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                    placeholder="Sub-category (e.g. Clothing)"
                                />
                                {errors.secondLevelCategory && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.secondLevelCategory}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">
                                    Third Level Category
                                </label>
                                <select
                                    value={thirdLevelCategory}
                                    onChange={(e) => setThirdLevelCategory(e.target.value)}
                                    className={`w-full bg-slate-900/50 border ${errors.thirdLevelCategory ? "border-red-500" : "border-slate-700"
                                        } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300`}
                                >
                                    <option value="">Select a category</option>
                                    <option value="Shirt">Shirt</option>
                                    <option value="Tshirt">Tshirt</option>
                                    <option value="Sweater">Sweater</option>
                                    <option value="Sweatshirt">Sweatshirt</option>
                                    <option value="Jacket">Jacket</option>
                                    <option value="Trouser">Trouser</option>
                                    <option value="Jean">Jean</option>
                                    <option value="Short">Short</option>
                                </select>
                                {errors.thirdLevelCategory && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.thirdLevelCategory}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Images */}
                <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-300">Additional Images</h3>
                        <button
                            type="button"
                            onClick={addImageField}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-cyan-600/30 text-cyan-200 hover:bg-cyan-600/50 border border-cyan-700/50 flex items-center gap-1"
                        >
                            <Plus size={14} />
                            Add Image
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="group bg-slate-900/40 rounded-lg border border-slate-700/50 p-3 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="relative mb-3">
                                    <input
                                        type="text"
                                        value={img}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300 transition-all pr-8"
                                        placeholder={`Image URL ${index + 1}`}
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="text-slate-500 hover:text-red-400 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="aspect-square h-80 w-80 overflow-hidden rounded-lg flex items-center justify-center transition-all bg-slate-900/50 group-hover:border-cyan-500/30">
                                        {img ? (
                                            <img
                                                src={img || "/placeholder.svg"}
                                                alt={`Preview ${index + 1}`}
                                                className="object-contain w-full h-full"
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = "/placeholder.svg?height=200&width=200"
                                                }}
                                            />
                                        ) : (
                                            <ImageIcon className="h-12 w-12 text-slate-700" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {images.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                            <ImageIcon className="h-16 w-16 mb-3 text-slate-700" />
                            <p className="text-sm">No additional images added yet</p>
                            <button
                                type="button"
                                onClick={addImageField}
                                className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-cyan-600/30 text-cyan-200 hover:bg-cyan-600/50 border border-cyan-700/50 flex items-center gap-1"
                            >
                                <Plus size={14} />
                                Add First Image
                            </button>
                        </div>
                    )}
                </div>

                {/* Size Quantities */}
                <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4 text-slate-300">Size Quantities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                        {size.map((s, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-slate-400 mb-1">{s.name}</label>
                                <input
                                    type="number"
                                    value={s.quantity}
                                    onChange={(e) => handleSizeInputChange(index, "quantity", e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="0"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Update Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AdminEditProduct
