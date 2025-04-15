import React from "react";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

const ProductCarousel = ({ title, products, loading, page, pageSize, onLeftArrow, onRightArrow }) => {
    return (
        <div className="py-4 relative">
            <div className="py-6">
                <p className="text-2xl text-gray-900 font-bold">{title}</p>
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
                        onClick={onLeftArrow}
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
                        onClick={onRightArrow}
                        disabled={loading || products.length < pageSize}
                    >
                        <IoMdArrowDroprightCircle size={40} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <p className="mt-4 text-gray-500">No similar products available.</p>
                </div>
            )}
        </div>
    )
}

export default ProductCarousel;