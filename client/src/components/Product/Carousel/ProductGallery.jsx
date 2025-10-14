// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FaHeart } from "react-icons/fa";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { addToWishlist, getWishlist, removeFromWishlist } from "../../redux/customer/wishlist/action";
// import ErrorPage from "../../pages/ErrorPage";
// import { Loader2Icon } from "lucide-react";

// const ImageCarousel = ({ product }) => {

//     const dispatch = useDispatch();
//     const { isAuthenticated } = useSelector((state) => state.auth);
//     const { wishlist, loading, error } = useSelector((state) => state.wishlist);

//     const isOutOfStock = product.quantity === 0;
//     const [isWishlist, setIsWishlist] = useState(false);

//     useEffect(() => {
//         if (isAuthenticated) dispatch(getWishlist());
//     }, [isAuthenticated, product]);

//     useEffect(() => {
//         setIsWishlist(wishlist.some(item => item.product?.id === product.id));
//     }, [wishlist, product.id]);

//     const toggleWishlist = () => {
//         isWishlist ? dispatch(removeFromWishlist(product.id)) : dispatch(addToWishlist(product.id));
//     };

//     if (error) {
//         return <ErrorPage
//             code={400}
//             title='An Error Occurred!'
//             description={error}
//         />
//     };

//     return (
//             <Carousel
//                 infiniteLoop={true}
//                 showIndicators={false}
//                 showStatus={false}
//                 thumbWidth={60}
//                 className="w-4/6 min-w-0"
//             >
//                 {product?.images?.map((image, index) => (
//                     <div key={index} className="relative">
//                         <img
//                             src={image}
//                             alt={`Product ${index}`}
//                             className={`w-full object-cover sm:rounded-lg ${isOutOfStock && "grayscale opacity-50"}`}
//                         />
//                         {isOutOfStock ? (
//                             <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-gray-300 bg-opacity-70">
//                                 <span className="text-white text-2xl font-semibold">
//                                     Out of Stock
//                                 </span>
//                             </div>
//                         ) : isAuthenticated && (
//                             <button
//                                 onClick={toggleWishlist}
//                                 className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg text-gray-400"
//                             >
//                                 {loading ?
//                                     <Loader2Icon className="animate-spin" size={20} /> :
//                                     <FaHeart className={isWishlist && `text-red-500`} size={20} />
//                                 }
//                             </button>
//                         )}
//                     </div>
//                 ))}
//             </Carousel >
//     );
// };

// export default ImageCarousel;






// import { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FaHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import { Loader2Icon } from "lucide-react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import ErrorPage from "../../pages/ErrorPage";
// import { addToWishlist, getWishlist, removeFromWishlist } from "../../redux/customer/wishlist/action";

// const ProductGallery = ({ product }) => {
//     const dispatch = useDispatch();
//     const { isAuthenticated } = useSelector((state) => state.auth);
//     const { wishlist, loading, error } = useSelector((state) => state.wishlist);

//     const [isWishlist, setIsWishlist] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [swiperInstance, setSwiperInstance] = useState(null);
//     const [showScrollUp, setShowScrollUp] = useState(false);
//     const [showScrollDown, setShowScrollDown] = useState(true);
//     const [containerHeight, setContainerHeight] = useState(500);
//     const thumbnailContainerRef = useRef(null);
//     const mainImageRef = useRef(null);
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

//     const handleScroll = () => {
//         const container = thumbnailContainerRef.current;
//         if (container) {
//             setShowScrollUp(container.scrollTop > 0);
//             setShowScrollDown(
//                 container.scrollTop < container.scrollHeight - container.clientHeight - 5
//             );
//         }
//     };

//     const scrollThumbnails = (direction) => {
//         const container = thumbnailContainerRef.current;
//         if (container) {
//             const scrollAmount = direction === 'up' ? -100 : 100;
//             container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
//         }
//     };

//     useEffect(() => {
//         const container = thumbnailContainerRef.current;
//         if (container) {
//             handleScroll();
//             container.addEventListener('scroll', handleScroll);
//             return () => container.removeEventListener('scroll', handleScroll);
//         }
//     }, [product?.images]);

//     useEffect(() => {
//         const updateHeight = () => {
//             if (mainImageRef.current) {
//                 const height = mainImageRef.current.clientHeight;
//                 setContainerHeight(height);
//             }
//         };

//         updateHeight();
//         window.addEventListener('resize', updateHeight);

//         // Add a slight delay to ensure images are loaded
//         const timer = setTimeout(updateHeight, 100);

//         return () => {
//             window.removeEventListener('resize', updateHeight);
//             clearTimeout(timer);
//         };
//     }, [product?.images]);

//     if (error) {
//         return <ErrorPage code={400} title='An Error Occurred!' description={error} />;
//     }

//     return (
//         <div className="min-w-0">
//             <div className="flex flex-col md:flex-row gap-3">
//                 {/* Thumbnail Sidebar - Desktop Only */}
//                 <div className="hidden md:flex md:flex-col md:w-16 lg:w-20 flex-shrink-0 relative">
//                     {/* Scroll Up Button */}
//                     {showScrollUp && (
//                         <button
//                             onClick={() => scrollThumbnails('up')}
//                             className="absolute top-0 left-0 right-0 z-10 bg-white/90 hover:bg-white py-2 flex items-center justify-center shadow-sm transition-colors"
//                         >
//                             <FaChevronUp className="text-gray-600" size={14} />
//                         </button>
//                     )}

//                     {/* Thumbnails Container */}
//                     <div
//                         ref={thumbnailContainerRef}
//                         className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden hide-scrollbar py-1"
//                         style={{ maxHeight: `${containerHeight}px` }}
//                     >
//                         {product?.images?.map((image, index) => (
//                             <button
//                                 key={index}
//                                 onClick={() => handleThumbnailClick(index)}
//                                 onMouseEnter={() => handleThumbnailHover(index)}
//                                 className={`relative border rounded overflow-hidden flex-shrink-0 transition-all duration-150 ${activeIndex === index
//                                         ? "border-blue-500 border-2"
//                                         : "border-gray-300 hover:border-gray-500"
//                                     }`}
//                             >
//                                 <img
//                                     src={image}
//                                     alt={`Thumbnail ${index + 1}`}
//                                     className={`w-full h-16 lg:h-20 object-cover ${isOutOfStock && "grayscale opacity-50"
//                                         }`}
//                                 />
//                             </button>
//                         ))}
//                     </div>

//                     {/* Scroll Down Button */}
//                     {showScrollDown && (
//                         <button
//                             onClick={() => scrollThumbnails('down')}
//                             className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 hover:bg-white py-2 flex items-center justify-center shadow-sm transition-colors"
//                         >
//                             <FaChevronDown className="text-gray-600" size={14} />
//                         </button>
//                     )}
//                 </div>

//                 {/* Main Swiper Carousel */}
//                 <div className="flex-1 min-w-0">
//                     <Swiper
//                         modules={[Navigation, Pagination]}
//                         navigation
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

//             <style jsx>{`
//                 .hide-scrollbar {
//                     -ms-overflow-style: none;
//                     scrollbar-width: none;
//                 }
//                 .hide-scrollbar::-webkit-scrollbar {
//                     display: none;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default ProductGallery;









import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { addToWishlist, getWishlist, removeFromWishlist } from "../../../redux/customer/wishlist/action";
import ErrorPage from "../../../pages/ErrorPage";
import { Loader2Icon } from "lucide-react";

const ProductGallery = ({ product }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { wishlist, loading, error } = useSelector((state) => state.wishlist);

    const [isWishlist, setIsWishlist] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [showScrollUp, setShowScrollUp] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [containerHeight, setContainerHeight] = useState(500);
    const thumbnailContainerRef = useRef(null);
    const mainImageRef = useRef(null);
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

    const handleThumbnailClick = (index) => {
        if (swiperInstance) {
            swiperInstance.slideToLoop(index);
        }
    };

    const handleThumbnailHover = (index) => {
        if (swiperInstance) {
            swiperInstance.slideToLoop(index);
        }
    };

    // const handleScroll = () => {
    //     const container = thumbnailContainerRef.current;
    //     if (container) {
    //         setShowScrollUp(container.scrollTop > 5);
    //         setShowScrollDown(
    //             container.scrollTop < container.scrollHeight - container.clientHeight - 5
    //         );
    //     }
    // };

    const handleScroll = useCallback(() => {
        const container = thumbnailContainerRef.current;
        if (container) {
            // Check if there is scrollable content
            const hasScroll = container.scrollHeight > container.clientHeight;
            if (!hasScroll) {
                setShowScrollUp(false);
                setShowScrollDown(false);
                return;
            }
            // Show arrows based on scroll position
            setShowScrollUp(container.scrollTop > 5);
            setShowScrollDown(
                container.scrollTop < container.scrollHeight - container.clientHeight - 5
            );
        }
    }, []);

    const scrollThumbnails = (direction) => {
        const container = thumbnailContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'up' ? -400 : 400;
            container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
        }
    };

    // useEffect(() => {
    //     const container = thumbnailContainerRef.current;
    //     if (container) {
    //         handleScroll();
    //         container.addEventListener('scroll', handleScroll);
    //         return () => container.removeEventListener('scroll', handleScroll);
    //     }
    // }, [product?.images, containerHeight]);

    // useEffect(() => {
    //     const updateHeight = () => {
    //         if (mainImageRef.current) {
    //             const height = mainImageRef.current.clientHeight;
    //             setContainerHeight(height);
    //             // Trigger scroll check after height update
    //             setTimeout(() => handleScroll(), 50);
    //         }
    //     };

    //     // Initial update
    //     updateHeight();

    //     // Listen for window resize
    //     window.addEventListener('resize', updateHeight);

    //     // Use MutationObserver to detect when images load and swiper renders
    //     const observer = new MutationObserver(updateHeight);
    //     if (mainImageRef.current) {
    //         observer.observe(mainImageRef.current, {
    //             childList: true,
    //             subtree: true,
    //             attributes: true
    //         });
    //     }

    //     // Multiple delayed checks to catch image loading
    //     const timers = [100, 300, 500, 1000].map(delay =>
    //         setTimeout(updateHeight, delay)
    //     );

    //     return () => {
    //         window.removeEventListener('resize', updateHeight);
    //         observer.disconnect();
    //         timers.forEach(timer => clearTimeout(timer));
    //     };
    // }, [product?.images]);

    // NEW & IMPROVED useEffect #1: Sync main image height to the thumbnail container
    useEffect(() => {
        const mainImageEl = mainImageRef.current;
        if (!mainImageEl) return;

        // Use ResizeObserver to detect size changes of the main image container
        const observer = new ResizeObserver(entries => {
            // We only observe one element, so we can grab the first entry
            const entry = entries[0];
            if (entry) {
                const height = entry.contentRect.height;
                setContainerHeight(height);
            }
        });

        observer.observe(mainImageEl);

        // Cleanup function to disconnect the observer
        return () => observer.disconnect();

    }, [product?.images]); // Re-run only if the product images change

    // NEW & IMPROVED useEffect #2: Manage scroll arrows visibility
    useEffect(() => {
        const container = thumbnailContainerRef.current;
        if (container) {
            // Run once to set initial state
            handleScroll();

            // Add scroll event listener
            container.addEventListener('scroll', handleScroll);

            // Cleanup listener
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [containerHeight, handleScroll, product?.images]); // Re-run when height changes

    if (error) {
        return <ErrorPage code={400} title='An Error Occurred!' description={error} />;
    }

    return (
        <div className="min-w-0">
            <div className="flex flex-col md:flex-row gap-3">
                {/* Thumbnail Sidebar - Desktop Only */}
                <div className="hidden md:flex md:flex-col md:w-16 lg:w-20 flex-shrink-0 relative">
                    {/* Scroll Up Button */}
                    {showScrollUp && (
                        <button
                            onClick={() => scrollThumbnails('up')}
                            className="absolute top-0 left-0 right-0 z-10 bg-white/95 hover:bg-white py-2 flex items-center justify-center shadow-md border-b transition-colors"
                        >
                            <FaChevronUp className="text-gray-600" size={14} />
                        </button>
                    )}

                    {/* Thumbnails Container */}
                    <div
                        ref={thumbnailContainerRef}
                        className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden hide-scrollbar"
                        style={{
                            height: `${containerHeight}px`,
                            paddingTop: showScrollUp ? '40px' : '0',
                            paddingBottom: showScrollDown ? '40px' : '0'
                        }}
                    >
                        {product?.images?.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => handleThumbnailClick(index)}
                                onMouseEnter={() => handleThumbnailHover(index)}
                                className={`relative border rounded overflow-hidden flex-shrink-0 transition-all duration-150 ${activeIndex === index
                                    ? "border-primary-500"
                                    : "border-primary-300 hover:border-gray-500"
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-full h-16 lg:h-full object-cover ${isOutOfStock && "grayscale opacity-50"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Scroll Down Button */}
                    {showScrollDown && (
                        <button
                            onClick={() => scrollThumbnails('down')}
                            className="absolute bottom-0 left-0 right-0 z-10 bg-white/95 hover:bg-white py-2 flex items-center justify-center shadow-md border-t transition-colors"
                        >
                            <FaChevronDown className="text-gray-600" size={14} />
                        </button>
                    )}
                </div>

                {/* Main Swiper Carousel */}
                <div className="flex-1 min-w-0" ref={mainImageRef}>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        pagination={{ clickable: true }}
                        loop={true}
                        className="w-full h-full"
                        onSwiper={setSwiperInstance}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    >
                        {product?.images?.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative">
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className={`w-full object-cover sm:rounded-lg ${isOutOfStock && "grayscale opacity-50"
                                            }`}
                                    />

                                    {isOutOfStock ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-70 rounded-lg">
                                            <span className="text-white text-2xl font-semibold">
                                                Out of Stock
                                            </span>
                                        </div>
                                    ) : isAuthenticated && (
                                        <button
                                            onClick={toggleWishlist}
                                            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg text-gray-400 z-10 hover:scale-110 transition-transform"
                                        >
                                            {loading ? (
                                                <Loader2Icon className="animate-spin" size={20} />
                                            ) : (
                                                <FaHeart className={isWishlist ? "text-red-500" : ""} size={20} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default ProductGallery;