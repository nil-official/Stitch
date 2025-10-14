import { FaStar } from "react-icons/fa";

const RatingButton = ({ product, scrollToReviews }) => {
    return (
        product.totalReviews > 0 && (
            <div className="bg-white rounded-xl py-1 px-2 flex gap-2 items-center" onClick={scrollToReviews}>
                <div className="flex items-center">
                    <p className="text-xs font-medium mr-0.5">{product.averageRating}</p>
                    <FaStar className="text-yellow-500 w-3 h-3" />
                </div>
                <p className="text-xxs">{product.totalReviews}</p>
            </div>
        ));
};

export default RatingButton;