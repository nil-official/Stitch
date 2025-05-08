import { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { IoStar } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { FiEdit } from "react-icons/fi";
import BASE_URL from "../utils/baseurl";

const TotalOrderComponent = ({ orderData, totalDetails, status }) => {
    const [review, setReview] = useState('');
    const [productId, setProductId] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [showReviewBox, setShowReviewBox] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (orderData && orderData.product) {
            setProductId(orderData.product.id);
            if (orderData.product.reviews.length) setRating(orderData.product.reviews[0].rating);
            if (orderData.product.reviews.length) setReview(orderData.product.reviews[0].review);
        }
    }, [orderData]);

    const sendReview = async () => {
        try {
            const res = await axios.post('/api/reviews', { productId, rating, review });
            if (res) {
                setIsEditing(!isEditing);
                toast.success('Review Added!')
            }
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    const handleRatingReview = () => {
        setShowReviewBox(!showReviewBox);
    };

    return (
        <div>
            {orderData && (
                <div className="pt-6 text-gray-700 flex flex-col bg-white">
                    {/* Product Image and Details */}
                    <div className="flex items-center gap-4">
                        <img
                            className="w-16 sm:w-20 cursor-pointer"
                            src={orderData.product.preview}
                            alt={orderData.product.title}
                            onClick={() => navigate(`/product/${orderData.product.id}`)}
                        />
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold">{orderData.product.title}</p>
                            <p className="text-sm text-gray-600">
                                Size: {orderData.size[0] === 'T' ? orderData.size.split('T')[1] : orderData.size}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    {totalDetails.orderStatus == 'DELIVERED' && !showReviewBox && (
                        <div className="font-semibold cursor-pointer py-2" onClick={handleRatingReview}>
                            Write a review or rating?
                        </div>
                    )}

                    {/* Rating review section */}
                    {showReviewBox && (
                        <div className="pt-2">
                            {/* Rating section */}
                            <div>
                                <p className="font-semibold">Add a Rating:</p>
                                <div className="flex justify-between my-2">
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <IoStar
                                                key={star}
                                                className={`cursor-pointer text-xl 
                                            ${rating >= star ? "text-gray-500" : "text-gray-300"}`}
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Review section */}
                            <div>
                                <p className="font-semibold mb-2">Submit a Review:</p>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                    rows="3"
                                    placeholder="Write your review here..."
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                ></textarea>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        className={`text-white py-2 px-6 rounded-md transition-all 
                                            ${rating === 0 || review === ''
                                                ? 'bg-gray-400'
                                                : 'bg-gray-800 hover:bg-gray-700'
                                            }`}
                                        disabled={rating === 0 || review === ''}
                                        onClick={() => {
                                            setSubmitted(true);
                                            setProductId(orderData.product.id);
                                            sendReview();
                                        }}
                                    >
                                        Submit Review
                                    </button>
                                    <button
                                        className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700"
                                        onClick={() => setShowReviewBox(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TotalOrderComponent;
