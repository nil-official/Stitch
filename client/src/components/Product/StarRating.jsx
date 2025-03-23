import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((index) => {
                if (rating >= index + 1) {
                    return <FaStar key={index} className="text-yellow-500 w-4 h-4" />;
                } else if (rating > index && rating < index + 1) {
                    return <FaStarHalfAlt key={index} className="text-yellow-500 w-4 h-4" />;
                } else {
                    return <FaRegStar key={index} className="text-gray-300 w-4 h-4" />;
                }
            })}
        </div>
    )
}

export default StarRating;