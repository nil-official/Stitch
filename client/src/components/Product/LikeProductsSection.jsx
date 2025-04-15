import React, { useEffect, useState } from "react";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import axios from "../../utils/axiosConfig";

const SimilarProductsSection = ({ productId }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(false);

    const fetchSimilarProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/products/like/${productId}?pageNumber=${page}&pageSize=${pageSize}`);
            if (res.data) {
                setTimeout(() => {
                    setProducts(res.data.content);
                    setLoading(false);
                }, 500);
            }
        } catch (err) {
            console.log("Error fetching similar products:", err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSimilarProducts();
    }, [productId, page, pageSize]);

    const handleLeftArrow = () => {
        if (!loading && page != 1) {
            setPage((prev) => prev - 1)
        }
    };

    const handleRightArrow = () => {
        if (!loading && !(products.length < pageSize)) {
            setPage((prev) => prev + 1)
        }
    };

    return (
        <div className="py-4 relative">
            <div className="py-6">
                <p className="text-2xl text-gray-900 font-bold">Products You May Also Like</p>
            </div>

            {products.length ? (
                <div className={`relative px-12 py-2 transition-opacity duration-500 ${loading ? "opacity-20" : "opacity-100"}`}>
                    <Swiper
                        key={products.length}
                        slidesPerView={5}
                        spaceBetween={5}
                        speed={800}
                        allowTouchMove={false}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 5 },
                        }}
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={index}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Manual Arrows for Pagination */}
                    <button
                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10
                            ${loading
                                ? 'opacity-0'
                                : page != 1
                                    ? 'text-gray-600'
                                    : 'text-gray-200'
                            }`}
                        onClick={handleLeftArrow}
                        disabled={loading || page == 1}
                    >
                        <IoMdArrowDropleftCircle size={40} />
                    </button>

                    <button
                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10
                            ${loading
                                ? 'opacity-0'
                                : !(products.length < pageSize)
                                    ? 'text-gray-600'
                                    : 'text-gray-200'
                            }`}
                        onClick={handleRightArrow}
                        disabled={loading || products.length < pageSize}
                    >
                        <IoMdArrowDroprightCircle size={40} />
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default SimilarProductsSection;