import React, { forwardRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import StarRating from './StarRating';
import RatingStarsBar from './RatingStarsBar';
import Loader from '../Loader';
import { addLikeDislike, getReviews } from '../../redux/customer/review/action';

const ReviewSection = forwardRef(({ productId }, ref) => {

    const dispatch = useDispatch();
    const { reviews, stats, loading, error } = useSelector((state) => state.review);

    useEffect(() => {
        dispatch(getReviews(productId));
    }, [dispatch, productId]);

    const handleLikeDislike = async (reviewId, type) => {
        dispatch(addLikeDislike(reviewId, type));
    };

    return (
        <div ref={ref} className="py-4">
            <div className="py-6">
                <p className="text-2xl text-gray-900 font-bold">
                    Ratings & Reviews
                </p>
            </div>

            {error ? (
                <ErrorPage code={400} title='An Error Occurred!' description={error} />
            ) : (loading ? (
                <Loader />
            ) : (reviews.length > 0 ? (
                <div className="py-4 flex justify-between gap-12 w-full">
                    {/* Left Column: Rating Stats */}
                    <div className='flex flex-col w-1/3 items-center gap-6'>
                        <div className="flex flex-col items-center">
                            <div className="text-4xl font-semibold flex gap-2 p-2">
                                <p>{stats.average}</p>
                                <FaStar className="text-yellow-500 w-10 h-10" />
                            </div>
                            <div className="text-sm text-gray-600">
                                Out of {stats.total} ratings
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            {RatingStarsBar(stats, 5, stats.fiveStar, "bg-green-600")}
                            {RatingStarsBar(stats, 4, stats.fourStar, "bg-lime-500")}
                            {RatingStarsBar(stats, 3, stats.threeStar, "bg-yellow-400")}
                            {RatingStarsBar(stats, 2, stats.twoStar, "bg-orange-400")}
                            {RatingStarsBar(stats, 1, stats.oneStar, "bg-red-500")}
                        </div>
                    </div>

                    {/* Right Column: Reviews List */}
                    <div className='w-2/3 max-h-[500px] overflow-y-auto pr-2'>
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
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <p className="mt-4 text-gray-500">No reviews available for this product.</p>
                </div>
            )))}
        </div>
    )
})

export default ReviewSection;