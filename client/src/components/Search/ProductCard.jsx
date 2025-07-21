import { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { PRODUCT, RECOMMENDED } from '../../assets/asset';

const ProductCard = ({ product }) => {

    const [currency, setCurrency] = useState('INR');
    const isOutOfStock = product.quantity === 0;

    return (
        <Link to={`/product/${product.id}`}>
            <div className={`p-2 group relative flex flex-col h-full rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105  ${isOutOfStock ? 'opacity-75' : ''}`}>
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
                <div className="mt-4 space-y-2 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.brand}
                        </h3>
                        {product.averageRating != 0 && (
                            <div className="flex items-center bg-green-500 text-white text-xs font-medium px-1 py-0.5 rounded">
                                <FaStar size={10} className="mr-1" />
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