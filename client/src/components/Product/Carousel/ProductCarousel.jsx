// import React from "react";
// import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from "react-icons/io";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "./ProductCard";

// const ProductCarousel = ({ title, products, loading, page, pageSize, onLeftArrow, onRightArrow }) => {
//     return (
//         <div className="py-4 relative">
//             <div className="py-6">
//                 <p className="text-2xl text-gray-900 font-bold">{title}</p>
//             </div>

//             {products.length ? (
//                 <div className={`relative px-12 py-2 transition-opacity duration-500 ${loading ? "opacity-20" : "opacity-100"}`}>
//                     <Swiper
//                         key={products.length}
//                         slidesPerView={5}
//                         spaceBetween={5}
//                         speed={800}
//                         allowTouchMove={false}
//                         breakpoints={{
//                             640: { slidesPerView: 2 },
//                             768: { slidesPerView: 3 },
//                             1024: { slidesPerView: 5 },
//                         }}
//                     >
//                         {products.map((product, index) => (
//                             <SwiperSlide key={index}>
//                                 <ProductCard product={product} />
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>

//                     {/* Manual Arrows for Pagination */}
//                     <button
//                         className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10
//                                 ${loading
//                                 ? 'opacity-0'
//                                 : page != 1
//                                     ? 'text-gray-600'
//                                     : 'text-gray-200'
//                             }`}
//                         onClick={onLeftArrow}
//                         disabled={loading || page == 1}
//                     >
//                         <IoMdArrowDropleftCircle size={40} />
//                     </button>

//                     <button
//                         className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10
//                                 ${loading
//                                 ? 'opacity-0'
//                                 : !(products.length < pageSize)
//                                     ? 'text-gray-600'
//                                     : 'text-gray-200'
//                             }`}
//                         onClick={onRightArrow}
//                         disabled={loading || products.length < pageSize}
//                     >
//                         <IoMdArrowDroprightCircle size={40} />
//                     </button>
//                 </div>
//             ) : (
//                 <div className="flex items-center justify-center">
//                     <p className="mt-4 text-gray-500">No similar products available.</p>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ProductCarousel;



import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { addToWishlist, getWishlist, removeFromWishlist } from "../../../redux/customer/wishlist/action";
import ErrorPage from "../../../pages/ErrorPage";
import { Loader2Icon } from "lucide-react";

const ProductCarousel = ({ product }) => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { wishlist, loading, error } = useSelector((state) => state.wishlist);

    const [isWishlist, setIsWishlist] = useState(false);
    const isOutOfStock = product.quantity === 0;

    useEffect(() => {
        if (isAuthenticated) dispatch(getWishlist());
    }, [isAuthenticated, product]);

    useEffect(() => {
        setIsWishlist(wishlist.some(item => item.product?.id === product.id));
    }, [wishlist, product.id]);

    const toggleWishlist = () => {
        isWishlist ? dispatch(removeFromWishlist(product.id)) : dispatch(addToWishlist(product.id));
    };

    if (error) {
        return <ErrorPage code={400} title='An Error Occurred!' description={error} />;
    }

    return (
        <div className="min-w-0">
            <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                loop={true}
                className="w-full h-full"
            >
                {product?.images?.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative">
                            <img
                                src={image}
                                alt={`Product ${index}`}
                                className={`w-full object-cover md:rounded-lg ${isOutOfStock && "grayscale opacity-50"}`}
                            />

                            {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-70 rounded-lg">
                                    <span className="text-white text-2xl font-semibold">
                                        Out of Stock
                                    </span>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductCarousel;









// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FaHeart } from "react-icons/fa";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Thumbs } from "swiper/modules";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { addToWishlist, getWishlist, removeFromWishlist } from "../../redux/customer/wishlist/action";
// import ErrorPage from "../../pages/ErrorPage";
// import { Loader2Icon } from "lucide-react";

// const ProductCarousel = ({ product }) => {
//     const dispatch = useDispatch();
//     const { isAuthenticated } = useSelector((state) => state.auth);
//     const { wishlist, loading, error } = useSelector((state) => state.wishlist);

//     const [isWishlist, setIsWishlist] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [swiperInstance, setSwiperInstance] = useState(null);
//     const isOutOfStock = product.quantity === 0;

//     useEffect(() => {
//         if (isAuthenticated) dispatch(getWishlist());
//     }, [isAuthenticated, product]);

//     useEffect(() => {
//         setIsWishlist(wishlist.some(item => item.product?.id === product.id));
//     }, [wishlist, product.id]);

//     const toggleWishlist = () => {
//         isWishlist ? dispatch(removeFromWishlist(product.id)) : dispatch(addToWishlist(product.id));
//     };

//     const handleThumbnailClick = (index) => {
//         if (swiperInstance) {
//             swiperInstance.slideToLoop(index);
//         }
//     };

//     const handleThumbnailHover = (index) => {
//         if (swiperInstance) {
//             swiperInstance.slideToLoop(index);
//         }
//     };

//     if (error) {
//         return <ErrorPage code={400} title='An Error Occurred!' description={error} />;
//     };

//     return (
//         <div className="min-w-0">
//             <div className="flex flex-col md:flex-row gap-3">
//                 {/* Thumbnail Sidebar - Desktop Only */}
//                 <div className="hidden md:flex md:flex-col gap-1.5 md:w-12 lg:w-14 flex-shrink-0 overflow-y-auto max-h-[500px]">
//                     {product?.images?.map((image, index) => (
//                         <button
//                             key={index}
//                             onClick={() => handleThumbnailClick(index)}
//                             onMouseEnter={() => handleThumbnailHover(index)}
//                             className={`relative border rounded overflow-hidden flex-shrink-0 transition-all duration-150 ${activeIndex === index
//                                 ? "border-orange-500 border-2"
//                                 : "border-gray-300 hover:border-gray-500"
//                                 }`}
//                         >
//                             <img
//                                 src={image}
//                                 alt={`Thumbnail ${index + 1}`}
//                                 className={`w-full h-12 lg:h-14 object-cover ${isOutOfStock && "grayscale opacity-50"
//                                     }`}
//                             />
//                         </button>
//                     ))}
//                 </div>


//                 {/* Main Swiper Carousel */}
//                 <div className="flex-1 min-w-0">
//                     <Swiper
//                         modules={[Thumbs]}
//                         pagination={{ clickable: true }}
//                         loop={true}
//                         className="w-full h-full"
//                         onSwiper={setSwiperInstance}
//                         onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
//                     >
//                         {product?.images?.map((image, index) => (
//                             <SwiperSlide key={index}>
//                                 <div className="relative">
//                                     <img
//                                         src={image}
//                                         alt={`Product ${index + 1}`}
//                                         className={`w-full object-cover sm:rounded-lg ${isOutOfStock && "grayscale opacity-50"
//                                             }`}
//                                     />

//                                     {isOutOfStock ? (
//                                         <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-70 rounded-lg">
//                                             <span className="text-white text-2xl font-semibold">
//                                                 Out of Stock
//                                             </span>
//                                         </div>
//                                     ) : isAuthenticated && (
//                                         <button
//                                             onClick={toggleWishlist}
//                                             className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg text-gray-400 z-10 hover:scale-110 transition-transform"
//                                         >
//                                             {loading ? (
//                                                 <Loader2Icon className="animate-spin" size={20} />
//                                             ) : (
//                                                 <FaHeart className={isWishlist ? "text-red-500" : ""} size={20} />
//                                             )}
//                                         </button>
//                                     )}
//                                 </div>
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCarousel;