import React, { forwardRef, useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { format, parseISO } from "date-fns";
import StarRating from './StarRating';
import axios from '../../utils/axiosConfig';

const ReviewSection = forwardRef(({ productId }, ref) => {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, [productId])

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/reviews/product/${productId}`);
            if (res) {
                setReviews(res.data.reviews);
            }
        } catch (err) {
            console.error('Failed to fetch review:', err);
        }
    }

    const handleLikeDislike = async (reviewId, type) => {
        try {
            const res = await axios.post(`/api/reviews/${reviewId}/${type}`);
            fetchReviews();
        } catch (err) {
            console.error(`Failed to ${type} review:`, err);
        }
    };

    return (
        <div ref={ref} className="py-4">
            <div className="py-6">
                <p className="text-2xl text-gray-900 font-bold">
                    Ratings & Reviews
                </p>
            </div>

            {reviews.length > 0 ? (
                <div className="py-4">
                    {reviews.map((item, index) => (
                        <div key={index} className="bg-white shadow-sm rounded-md p-4 mb-4 border border-gray-200">

                            {/* User Info */}
                            <div className="flex items-center space-x-3 text-gray-600">
                                <FaUserCircle size={28} />
                                <div>
                                    <p className="font-semibold">
                                        {item.firstName} {item.lastName}
                                    </p>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="flex items-center mt-2">
                                <StarRating rating={item.rating} />
                            </div>

                            {/* Review Content */}
                            <p className="mt-2 text-gray-700 font-semibold leading-relaxed">
                                {item.review}
                            </p>

                            {/* Date & Like Dislike */}
                            <div className='mt-2 flex justify-between'>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {format(parseISO(item.updatedAt), "do MMMM, yyyy")}
                                    </p>
                                </div>

                                <div className="flex gap-6 text-xs text-gray-600">
                                    <div
                                        className='flex items-center gap-2 cursor-pointer'
                                        onClick={() => handleLikeDislike(item.id, "like")}
                                    >
                                        {item.liked
                                            ? <AiFillLike size={24} />
                                            : <AiOutlineLike size={24} />
                                        }
                                        {item.likes}
                                    </div>
                                    <div
                                        className='flex items-center gap-2 cursor-pointer'
                                        onClick={() => handleLikeDislike(item.id, "dislike")}
                                    >
                                        {item.disliked
                                            ? <AiFillDislike size={24} />
                                            : <AiOutlineDislike size={24} />
                                        }
                                        {item.dislikes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-gray-500">No reviews available for this product.</p>
            )}
        </div>
    )
})

export default ReviewSection;