import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import BASE_URL from '../../utils/baseurl';
import axios from 'axios';

const ProductCard = ({ product }) => {

    const [currency, setCurrency] = useState('INR');
    const [wishlist, setWishlist] = useState(false);
    const [rating, setRating] = useState(0.0);
    const isOutOfStock = product.quantity === 0;

    useEffect(() => {
        const getRating = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/ratings/product/${product.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                    }
                });
                setRating(res.data.averageRating);
            } catch (err) {
                console.error("Error fetching rating:", err);
            }
        };
        getRating();
    }, [product.id]);

    const addToWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await axios.post(`${BASE_URL}/api/wishlist/add`, { productId: id, size }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });
            setWishlist(!wishlist);
            if (res.data) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add to wishlist");
        }
    };

    return (
        <div className={`group relative flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
            <Link to={`/product/${product.id}`} className="flex-grow">
                <div className="relative w-full pb-[100%] overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                    <img
                        className={`absolute top-0 left-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110 ${isOutOfStock ? 'filter grayscale' : ''}`}
                        src={product.imageUrl}
                        alt={product.brand}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg?height=300&width=300';
                            console.error('Error loading image:', image);
                        }}
                    />
                    {!isOutOfStock && (
                        <button
                            onClick={addToWishlist}
                            className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg ${wishlist ? 'text-red-500' : 'text-gray-400'} transition-all duration-300 opacity-0 group-hover:opacity-100 z-10`}
                            aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <FaHeart size={18} />
                        </button>
                    )}
                    {isOutOfStock ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60">
                            <span className="text-white text-xl font-semibold">Out of Stock</span>
                        </div>
                    ) : (
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className='flex justify-center items-center gap-2'>
                                {product.sizes
                                    .filter((item) => item.quantity > 0)
                                    .sort((a, b) => {
                                        const isATypeT = a.name.startsWith('T');
                                        const isBTypeT = b.name.startsWith('T');
                                        const sizeOrder = { XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6 };

                                        if (isATypeT && isBTypeT) {
                                            return parseInt(a.name.slice(1)) - parseInt(b.name.slice(1)); // Sort numerically
                                        } else if (isATypeT) {
                                            return -1; // 'a' comes before 'b'
                                        } else if (isBTypeT) {
                                            return 1; // 'b' comes after 'a'
                                        } else {
                                            // Sort size strings based on custom order
                                            return (sizeOrder[a.name] || 0) - (sizeOrder[b.name] || 0) || a.name.localeCompare(b.name);
                                        }
                                    })
                                    .map((item) => (
                                        <button
                                            key={item.name}
                                            disabled={item.quantity === 0}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSize(item.name);
                                            }}
                                            className={`text-xs font-semibold py-1 px-2 rounded-full transition-all duration-200
                                                    ${item.name === product.size
                                                    ? 'bg-white text-black shadow-lg transform scale-110'
                                                    : 'bg-black bg-opacity-50 text-white hover:bg-white hover:text-black'
                                                }
                                                `}
                                        >
                                            {item.name[0] === 'T' ? item.name.split('T')[1] : item.name}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </Link>
            <div className="mt-4 space-y-2 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{product.brand}</h3>
                    {rating != 0 && (
                        <div className="flex items-center bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
                            <FaStar className="mr-1" />
                            {rating.toFixed(1)}
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-500 truncate">{product.title}</p>
                {!isOutOfStock ? (
                    <div className="flex items-center space-x-2">
                        <p className="text-lg font-semibold text-gray-900">{currency}&nbsp;{product.discountedPrice}</p>
                        <p className="text-sm text-gray-500 line-through">{currency}&nbsp;{product.price}</p>
                        <p className="text-sm font-medium text-green-500">({product.discountPercent}% OFF)</p>
                    </div>
                ) : (
                    <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
            </div>
        </div>
    )
}

export default ProductCard;