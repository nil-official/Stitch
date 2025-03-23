import axios from 'axios';
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../utils/baseurl';

const WishListProductCard = ({ id, productId, image, name, size, price, discountedPrice, discountPercent, render, setRender }) => {
    const { currency, addToCart } = useContext(ShopContext);

    const onRemove = async (e) => {
        e.preventDefault(); // Prevent navigation when clicking remove button
        try {
            const res = await axios.delete(`${BASE_URL}/api/wishlist/remove/id/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });
            if (res) {
                setTimeout(() => toast.success(res.data.message), 0);
            }
            setRender(!render);
        } catch (err) {
            console.error("Something went wrong", err);
            toast.error("Failed to remove item from wishlist");
        }
    };

    const handleMoveToCart = async (e) => {
        e.preventDefault();
        try {
            addToCart(productId, size, 1); // Add item to cart
            await onRemove(e); // Call the onRemove function to remove it from the wishlist
        } catch (error) {
            console.error("Add to cart failed. Error: ", error);
            toast.error("Failed to move item to cart");
        }
    };


    return (
        <div className="mb-6">
            <Link to={`/product/${productId}`} className="text-gray-700 cursor-pointer block">
                <div className="relative group w-36 sm:w-40 md:w-48 lg:w-56">
                    {/* Product image */}
                    <div className="overflow-hidden h-48 sm:h-52 md:h-64 lg:h-72 flex items-center justify-center relative">
                        <img
                            className="hover:scale-110 transition ease-in-out w-full object-cover"
                            src={image}
                            alt={name}
                        />

                        {/* Remove from wishlist button */}
                        <button
                            className="absolute top-2 right-2 bg-gray-200 w-6 h-6 rounded-full text-gray-600 hover:bg-gray-300 flex items-center justify-center text-lg leading-none"
                            onClick={onRemove}
                        >
                            <IoMdClose />
                        </button>

                        {/* Add to Cart button (Initially hidden, appears on hover) */}
                        <button
                            onClick={handleMoveToCart}
                            className="absolute bottom-0 left-0 w-full bg-black text-white py-2 text-sm active:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            MOVE TO CART
                        </button>
                    </div>
                </div>

                {/* Product name */}
                <div className="w-40 font-semibold mb-2">{name}</div>

                {/* Product size */}
                {/* <div className="mb-2">Size: {size[0] === 'T' ? size.split('T')[1] : size}</div> */}

                {/* Product price and discount */}
                <div className="flex items-center gap-2 mt-2">
                    <p>{currency}&nbsp;{discountedPrice}</p>
                    <p className="text-gray-500 line-through">{currency}&nbsp;{price}</p>
                    <p className="text-green-500">({discountPercent}% OFF)</p>
                </div>
            </Link>
        </div>
    );
};

export default WishListProductCard;

