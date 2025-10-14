import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center mt-[1px] md:mt-0">
            {[0, 1, 2, 3, 4].map((index) => {
                if (rating >= index + 1) {
                    return <FaStar key={index} className="text-yellow-500 w-3 h-3 lg:w-4 lg:h-4" />;
                } else if (rating > index && rating < index + 1) {
                    return <FaStarHalfAlt key={index} className="text-yellow-500 w-3 h-3 lg:w-4 lg:h-4" />;
                } else {
                    return <FaRegStar key={index} className="text-gray-300 w-3 h-3 lg:w-4 lg:h-4" />;
                }
            })}
        </div>
    )
}

export default StarRating;