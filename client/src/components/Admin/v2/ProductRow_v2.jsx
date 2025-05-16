import { Edit2, Trash2 } from 'lucide-react'

const ProductRow_v2 = ({ product, onEdit, onDelete }) => {
    // Calculate total stock across all sizes
    const totalStock = product.sizes?.reduce((total, size) => total + size.quantity, 0) || 0

    // Calculate discount percentage
    const discountPercentage = product.price > 0
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : 0

    // Format price with currency symbol
    const formatPrice = (price) => `₹${price?.toLocaleString() || '0'}`

    // Get category path
    const categoryPath = [
        product.topLevelCategory,
        product.secondLevelCategory,
        product.thirdLevelCategory
    ].filter(Boolean).join(' › ')

    return (
        <div className="group bg-slate-900/30 hover:bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-700/70 transition-all duration-200 overflow-hidden relative">
            {/* Mobile View */}
            <div className="md:hidden p-3 space-y-2">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-800 mr-3">
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
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-slate-200 truncate">{product.title}</h3>
                        <p className="text-xs text-slate-400">{product.brand}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-slate-400">Price: </span>
                        <span className="text-slate-300 font-medium">{formatPrice(product.discountedPrice)}</span>
                        {discountPercentage > 0 && (
                            <span className="ml-1 text-green-400">(-{discountPercentage}%)</span>
                        )}
                    </div>
                    <div>
                        <span className="text-slate-400">Stock: </span>
                        <span className={`font-medium ${totalStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {totalStock > 0 ? `${totalStock} units` : 'Out of stock'}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700/30">
                    <button
                        onClick={onEdit}
                        className="p-1.5 rounded-md bg-slate-800 text-cyan-400 hover:bg-slate-700"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-md bg-slate-800 text-red-400 hover:bg-slate-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-12 gap-4 items-center p-3">
                {/* Image */}
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

                {/* Product Info */}
                <div className="col-span-3 min-w-0">
                    <h3 className="text-sm font-medium text-slate-200 truncate">{product.title}</h3>
                    <p className="text-xs text-slate-400">{product.brand}</p>
                </div>

                {/* Category */}
                <div className="col-span-2 text-xs text-slate-400 truncate">
                    {categoryPath}
                </div>

                {/* Price */}
                <div className="col-span-1 text-sm font-medium text-slate-300">
                    {formatPrice(product.discountedPrice)}
                </div>

                {/* Discount */}
                <div className="col-span-1">
                    {discountPercentage > 0 ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                            {discountPercentage}% off
                        </span>
                    ) : (
                        <span className="text-xs text-slate-500">No discount</span>
                    )}
                </div>

                {/* Stock */}
                <div className="col-span-2">
                    <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${totalStock > 10 ? 'bg-green-400' : totalStock > 0 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                        <span className="text-sm font-medium text-slate-300">{totalStock > 0 ? `${totalStock} units` : 'Out of stock'}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end space-x-2">
                    <button onClick={onEdit} className="p-1.5 rounded-md bg-slate-800 text-cyan-400 hover:bg-slate-700">
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={onDelete} className="p-1.5 rounded-md bg-slate-800 text-red-400 hover:bg-slate-700">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductRow_v2
