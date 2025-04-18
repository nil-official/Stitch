import React from 'react';
import { ChevronDown } from 'lucide-react';

const CartProductCard = ({ product, onRemove, onMoveToWishlist, onQuantityChange, onSizeChange }) => {
    return (
        <div className="border-b py-4">
            <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="pt-1">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-teal-600" checked />
                </div>

                {/* Product Image */}
                <div className="h-40 w-40 bg-gray-100 overflow-hidden">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        {/* Size Selector */}
                        <div className="relative">
                            <div className="flex items-center justify-between w-36 border rounded px-3 py-2 text-sm">
                                <span>Size: {product.size}</span>
                                <ChevronDown size={16} />
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="relative">
                            <div className="flex items-center justify-between w-36 border rounded px-3 py-2 text-sm">
                                <span>Qty: {product.quantity}</span>
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-600">
                        Estimated Delivery by {product.estimatedDelivery}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={() => onRemove(product.id)}
                            className="border border-gray-300 rounded px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            REMOVE
                        </button>
                        <button
                            onClick={() => onMoveToWishlist(product.id)}
                            className="border border-gray-300 rounded px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            MOVE TO WISHLIST
                        </button>
                    </div>
                </div>

                {/* Price */}
                <div className="text-right">
                    <p className="text-lg font-medium">₹ {product.price}</p>
                    <p className="text-sm text-gray-500">MRP incl. of all taxes</p>
                </div>
            </div>
        </div>
    );
};

export default CartProductCard;