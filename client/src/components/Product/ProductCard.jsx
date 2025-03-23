import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {

    const [currency, setCurrency] = useState('INR');
    const isOutOfStock = product.quantity === 0;

    const getRatingColor = (rating) => {
        if (rating >= 4.0) return "bg-green-500";
        if (rating >= 2.5) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <Link to={`/product/${product.id}`}>
            <div className={`p-2 relative flex flex-col h-full rounded-lg ${isOutOfStock && 'opacity-75'}`}>
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg">
                    <img
                        className={`absolute top-0 left-0 w-full h-full object-cover ${isOutOfStock && 'filter grayscale'}`}
                        src={product.preview}
                        alt={product.brand}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = '/product-placeholder.jpg';
                            console.error('Error loading image:', image);
                        }}
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60">
                            <span className="text-white text-xl font-semibold">Out of Stock</span>
                        </div>
                    )}
                </div>
                <div className="mt-4 space-y-2 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.brand}
                        </h3>
                        {product.averageRating > 0 && (
                            <div className={`flex items-center text-white text-xs font-medium px-2 py-1 rounded ${getRatingColor(product.averageRating)}`}>
                                <FaStar className="mr-1" />
                                {product.averageRating.toFixed(1)}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{product.title}</p>
                    {!isOutOfStock ? (
                        <div className="flex items-center space-x-2 truncate">
                            <p className="text-md font-medium text-gray-900">
                                {currency}&nbsp;{product.discountedPrice}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                                {currency}&nbsp;{product.price}
                            </p>
                            <p className="text-sm font-medium text-green-500">
                                ({product.discountPercent}% OFF)
                            </p>
                        </div>
                    ) : (
                        <p className="text-red-600 font-semibold">Out of Stock</p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ProductCard;