import { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { PRODUCT, RECOMMENDED } from '../../assets/asset';

const ProductCard = ({ product }) => {

    const [currency, setCurrency] = useState('INR');
    const isOutOfStock = product.quantity === 0;

    return (
        <Link to={`/product/${product.id}`}>
            <div className={`pb-4 md:p-2 md:shadow-md group relative flex flex-col h-full rounded-lg transition-all duration-300 hover:scale-105 
                ${isOutOfStock ? 'opacity-75' : ''}`}>
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg">
                    {product.rankScore > 9.5 &&
                        <img
                            src={RECOMMENDED}
                            alt="Recommended"
                            className="absolute w-[60%] z-10"
                        />
                    }
                    <img
                        className={`absolute top-0 left-0 w-full h-full object-cover ${isOutOfStock ? 'filter grayscale' : ''}`}
                        src={product.preview}
                        alt={product.brand}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = PRODUCT;
                            console.error('Error loading image:', image);
                        }}
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60">
                            <span className="text-white text-xl font-semibold">Out of Stock</span>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex-shrink-0 space-y-1 md:space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                            {product.brand}
                        </h3>
                        {product.averageRating != 0 && (
                            <div className="flex items-center bg-green-500 text-white text-[10px] md:text-xs font-medium px-1 py-0.5 rounded">
                                <FaStar className="mr-1 w-2 h-2 md:w-2.5 md:h-2.5" />
                                {product.averageRating.toFixed(1)}
                            </div>
                        )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                        {product.title}
                    </p>
                    {!isOutOfStock ? (
                        <div className="flex items-center space-x-1 md:space-x-2 truncate">
                            <p className="text-xs md:text-md font-medium text-gray-900">
                                {currency}&nbsp;{product.discountedPrice}
                            </p>
                            {product.price > product.discountedPrice &&
                                <p className="text-xs md:text-sm text-gray-500 line-through">
                                    {currency}&nbsp;{product.price}
                                </p>
                            }
                            {product.discountPercent > 0 &&
                                <p className="text-[10px] md:text-sm font-medium text-green-500">
                                    ({product.discountPercent}% OFF)
                                </p>
                            }
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