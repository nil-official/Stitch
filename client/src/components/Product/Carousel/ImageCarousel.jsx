import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import RatingButton from "../Buttons/RatingButton";

const ImageCarousel = ({ product, scrollToReviews }) => {
    return (
        <div className="min-w-0">
            <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                loop={true}
                className="relative w-full h-full"
            >
                {product?.images?.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative">
                            <img
                                src={image}
                                alt={`Product ${index}`}
                                className='w-full object-cover rounded-b-3xl md:rounded-lg'
                            />
                        </div>
                    </SwiperSlide>
                ))}
                <div className='absolute bottom-3 right-3 md:hidden z-20'>
                    <RatingButton
                        product={product}
                        scrollToReviews={scrollToReviews}
                    />
                </div>
            </Swiper>
        </div>
    );
};

export default ImageCarousel;