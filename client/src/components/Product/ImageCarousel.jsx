import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import axios from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageCarousel = ({ product }) => {

    const [wishlistItems, setWishlistItems] = useState([]);
    const [isWishlist, setIsWishlist] = useState(false);
    const isOutOfStock = product.quantity === 0;

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (isWishlist) {
                const res = await axios.delete(`/api/wishlist/remove/${product.id}`);
                if (res.data) {
                    toast.success(res.data.message);
                }
            } else {
                const res = await axios.post('/api/wishlist/add', { productId: product.id });
                if (res.data) {
                    toast.success(res.data.message);
                }
            }
            fetchWishlist();
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            toast.error(error.response?.data?.error || "An error occurred.");
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await axios.get('/api/wishlist/');
            if (res.data) {
                setWishlistItems(res.data.wishlistItems)
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [])

    useEffect(() => {
        setIsWishlist(wishlistItems.some(item => item.product?.id === product.id));
    }, [wishlistItems, product.id]);

    return (
        <div className="relative">
            <Carousel
                infiniteLoop={true}
                showIndicators={false}
                showStatus={false}
                thumbWidth={60}
                className="w-4/6"
            >
                {product?.images?.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image}
                            alt={`Product ${index}`}
                            className={`w-full object-cover sm:rounded-lg ${isOutOfStock && "grayscale opacity-50"}`}
                        />
                        {isOutOfStock
                            ?
                            <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-gray-300 bg-opacity-70">
                                <span className="text-white text-2xl font-semibold">
                                    Out of Stock
                                </span>
                            </div>
                            :
                            <button
                                onClick={toggleWishlist}
                                className={`absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg transition-all duration-300 ${isWishlist ? 'text-red-500' : 'text-gray-400'}`}
                            >
                                <FaHeart size={20} />
                            </button>
                        }
                    </div>
                ))}
            </Carousel >
        </div >
    );
};

export default ImageCarousel;