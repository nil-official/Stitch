import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { PlusCircle, ArrowLeft, ImageIcon, Plus, X } from "lucide-react"
import BASE_URL from "../../../utils/baseurl"
import decodeJWT from "../../../utils/decodeJWT"


const AdminCreateProduct = () => {
    const navigate = useNavigate()

    // State variables for the form fields
    const [imageUrl, setImageUrl] = useState("")
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


    // Function to handle size input fields
    const handleSizeInputChange = (index, field, value) => {
        const newSize = [...size]
        newSize[index][field] = field === "quantity" ? Number(value) : value
        setSize(newSize)
    }

    // Function to handle additional image URLs
    const handleImageUrlChange = (index, value) => {
        const newImages = [...images]
        newImages[index] = value
        setImages(newImages)
    }

    const removeImageField = (index) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
    }

    // Function to add another image field
    const addImageField = () => {
        setImages([...images, ""])
    }

    // Function to validate form fields
    const validateInputs = () => {
        if (
            !imageUrl ||
            !brand ||
            !title ||
            !color ||
            price === 0 ||
            discountedPrice === 0 ||
            !topLevelCategory ||
            !secondLevelCategory ||
            !thirdLevelCategory
        ) {
            toast.error("Please fill all the required fields")
            return false
        }
        return true
    }

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateInputs()) return

        const product = {
            imageUrl,
            brand,
            title,
            color,
            price,
            discountedPrice,
            description,
            topLevelCategory,
            secondLevelCategory,
            thirdLevelCategory,
            sizes: size.filter((s) => s.quantity > 0),
            preview: imageUrl,
            images: [imageUrl, ...images.filter(img => img !== "")]
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/admin/products/`, product, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            })
            if (res.data.error) {
                toast.error(res.data.error)
            } else {
                toast.success("Product created successfully")
                navigate("/admin/products")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    // Check if the user is an admin
    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities
            if (authorities.includes("ROLE_ADMIN")) {
                navigate("/admin/products/create")
            } else {
                navigate("/Log")
            }
        } else navigate("/Log")
    }, [navigate])

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <PlusCircle className="mr-2 h-6 w-6 text-cyan-500" />
                <h1 className="text-2xl font-bold">Create Product</h1>
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
                            {imageUrl ? (
                                <div className="w-full h-64 overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={imageUrl || "/placeholder.svg"}
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
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Enter image URL"
                                />
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
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Brand name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Product title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Discounted Price</label>
                                <input
                                    type="number"
                                    value={discountedPrice}
                                    onChange={(e) => setDiscountedPrice(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Color</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Color"
                                />
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
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Category (e.g. Men, Women)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Second Level Category</label>
                                <input
                                    type="text"
                                    value={secondLevelCategory}
                                    onChange={(e) => setSecondLevelCategory(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Sub-category (e.g. Clothing)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Third Level Category</label>
                                <select
                                    value={thirdLevelCategory}
                                    onChange={(e) => setThirdLevelCategory(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                        className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300 transition-all pr-8"
                                        placeholder={`Image URL ${index + 1}`}
                                    />
                                    <div className="px-2 absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">

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
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                    >
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AdminCreateProduct;