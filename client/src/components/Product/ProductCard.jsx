import { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { PRODUCT } from '../../assets/asset';
import { getProductUrl, getRatingColor } from '../../utils/productUtils';

const ProductCard = ({ product }) => {
    const [currency, setCurrency] = useState('INR');

    return (
        <Link to={getProductUrl(product)}>
            <div className='flex flex-col rounded-lg mb-2'>
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg">
                    <img
                        className='absolute top-0 left-0 w-full h-full object-cover'
                        src={product.preview}
                        alt={product.brand}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = PRODUCT;
                            console.error('Error loading image:', image);
                        }}
                    />
                </div>
                <div className="mt-2 flex-shrink-0 space-y-1">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                            {product.brand}
                        </h3>
                        {product.averageRating > 0 && (
                            <div
                                className={`flex items-center text-white text-xxs md:text-xs font-medium px-1 py-0.5 rounded 
                                    ${getRatingColor(product.averageRating)}`}
                            >
                                <FaStar className="mr-1 w-2 h-2 md:w-2.5 md:h-2.5" />
                                {product.averageRating.toFixed(1)}
                            </div>
                        )}
                    </div>
                    <p className="text-xxs md:text-xs text-gray-500 truncate">
                        {product.title}
                    </p>
                    <div className="flex items-center space-x-1 md:space-x-2 truncate">
                        <p className="text-xs md:text-sm font-medium text-gray-900">
                            {currency}&nbsp;{product.discountedPrice}
                        </p>
                        {product.price > product.discountedPrice &&
                            <p className="text-xxs md:text-xs text-gray-500 line-through">
                                {currency}&nbsp;{product.price}
                            </p>
                        }
                        {product.discountPercent > 0 &&
                            <p className="text-xxs md:text-xs font-medium text-green-500">
                                ({product.discountPercent}% OFF)
                            </p>
                        }
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard;