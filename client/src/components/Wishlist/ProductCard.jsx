import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IoMdClose } from "react-icons/io";
import { removeFromWishlist } from '../../redux/customer/wishlist/action';
import { FaStar } from 'react-icons/fa';
import { PRODUCT, RECOMMENDED } from '../../assets/asset';

const ProductCard = ({ product }) => {

    const dispatch = useDispatch();
    const [currency, setCurrency] = useState('INR');
    const isOutOfStock = product.quantity === 0;

    const removeFromWishlistHandler = () => {
        dispatch(removeFromWishlist(product.id));
    };

    return (
        <div className={`p-2 group relative flex flex-col h-full rounded-lg shadow-md ${isOutOfStock ? 'opacity-75' : ''}`}>
            <button
                className="z-10 absolute top-4 right-4 bg-gray-200 w-6 h-6 rounded-full text-gray-600 hover:bg-gray-300 flex items-center justify-center text-lg leading-none"
                onClick={removeFromWishlistHandler}
            >
                <IoMdClose />
            </button>
            <Link to={`/product/${product.id}`}>
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
            </Link>
        </div>
        // <div className="mb-6">
        //     <Link to={`/product/${product.id}`} className="text-gray-700 cursor-pointer block">
        //         <div className="relative group w-36 sm:w-40 md:w-48 lg:w-56">
        //             {/* Product image */}
        //             <div className="overflow-hidden h-48 sm:h-52 md:h-64 lg:h-72 flex items-center justify-center relative">
        //                 <img
        //                     className="hover:scale-110 transition ease-in-out w-full object-cover"
        //                     src={product.preview}
        //                     alt={product.title}
        //                 />

        //                 {/* Remove from wishlist button */}
        //                 <button
        //                     className="z-10 absolute top-2 right-2 bg-gray-200 w-6 h-6 rounded-full text-gray-600 hover:bg-gray-300 flex items-center justify-center text-lg leading-none"
        //                     onClick={removeFromWishlistHandler}
        //                 >
        //                     <IoMdClose />
        //                 </button>
        //             </div>
        //         </div>

        //         {/* Product name */}
        //         <div className="w-40 font-semibold mb-2">{product.title}</div>

        //         {/* Product price and discount */}
        //         <div className="flex items-center gap-2 mt-2">
        //             <p>{currency}&nbsp;{product.discountedPrice}</p>
        //             <p className="text-gray-500 line-through">{currency}&nbsp;{product.price}</p>
        //             <p className="text-green-500">({product.discountPercent}% OFF)</p>
        //         </div>
        //     </Link>
        // </div>
    );
};

export default ProductCard;