import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { addToWishlist, getWishlist, removeFromWishlist } from "../../redux/customer/wishlist/action";

const ImageCarousel = ({ product }) => {

    const dispatch = useDispatch();
    const isOutOfStock = product.quantity === 0;
    const [isWishlist, setIsWishlist] = useState(false);
    const { wishlist, loading, error } = useSelector((state) => state.wishlist);

    const toggleWishlist = () => {
        isWishlist ? dispatch(removeFromWishlist(product.id)) : dispatch(addToWishlist(product.id));
    };

    useEffect(() => {
        dispatch(getWishlist());
    }, [product]);

    useEffect(() => {
        setIsWishlist(wishlist.some(item => item.product?.id === product.id));
    }, [wishlist, product.id]);

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