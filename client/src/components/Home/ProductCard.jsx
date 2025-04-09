import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Zap, Sparkles, Award, TrendingUp } from 'lucide-react'
import { FaStar } from 'react-icons/fa'

const ProductCard = ({ product, index, style }) => {

    const [currency, setCurrency] = useState('INR');
    const iconStyles = {
        featured: <Star className="w-5 h-5 text-blue-500" />,
        discount: <Zap className="w-5 h-5 text-red-500" />,
        new: <Sparkles className="w-5 h-5 text-yellow-500" />,
        rated: <Award className="w-5 h-5 text-green-500" />,
        seller: <TrendingUp className="w-5 h-5 text-purple-500" />
    }

    return (
        <Link to={`/product/${product.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`max-w-52 sm:max-w-56 lg:max-w-60 xl:max-w-64 p-2 group relative flex flex-col h-full rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
                    <img
                        src={product.preview}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 p-1 rounded-full">
                        {iconStyles[style]}
                    </div>
                </div>

                <div className="mt-4 space-y-2 flex-shrink-0 w-full">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.brand}
                        </h3>
                        {product.averageRating != 0 && (
                            <div className="flex items-center bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
                                <FaStar className="mr-1" />
                                {product.averageRating.toFixed(1)}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 w-full block truncate">
                        {product.title}
                    </p>
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
                </div>
            </motion.div>
        </Link>
    )
}

export default ProductCard;