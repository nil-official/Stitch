import { forwardRef, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO } from "date-fns";
import { CircleUser, ChevronsDown, ChevronsUp } from 'lucide-react';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import StarRating from './StarRating';
import RatingStarsBar from './RatingStarsBar';
import ErrorPage from '../../../pages/ErrorPage';
import { getReviews, getUserReviews, addLikeDislike } from '../../../redux/customer/review/action';

const ReviewSection = forwardRef(({ productId }, ref) => {

    const dispatch = useDispatch();
    const scrollContainerRef = useRef(null);
    const [showUpArrow, setShowUpArrow] = useState(false);
    const [showDownArrow, setShowDownArrow] = useState(true);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { reviews, stats, loading, error } = useSelector((state) => state.review);

    useEffect(() => {
        if (!isAuthenticated)
            dispatch(getReviews(productId));
        else
            dispatch(getUserReviews(productId));
    }, [isAuthenticated, productId, dispatch]);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollContainerRef.current) {
                const { scrollHeight, clientHeight, scrollTop } = scrollContainerRef.current;

                // If content height is greater than container height, it's scrollable
                if (scrollHeight > clientHeight) {
                    // Check current scroll position to show appropriate arrow
                    if (scrollTop < 10) {
                        setShowDownArrow(true);
                        setShowUpArrow(false);
                    } else if (scrollTop + clientHeight >= scrollHeight - 10) {
                        setShowDownArrow(false);
                        setShowUpArrow(true);
                    } else {
                        setShowDownArrow(false);
                        setShowUpArrow(false);
                    }
                } else {
                    setShowDownArrow(false);
                    setShowUpArrow(false);
                }
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [reviews]);

    const handleLikeDislike = async (reviewId, type) => {
        if (isAuthenticated && !loading) dispatch(addLikeDislike(reviewId, type));
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        // Only show arrows if content is scrollable
        if (scrollHeight <= clientHeight) {
            setShowDownArrow(false);
            setShowUpArrow(false);
            return;
        }

        // Show down arrow only when at the top and there's more content below
        if (scrollTop < 10) {
            setShowDownArrow(true);
        } else {
            setShowDownArrow(false);
        }

        // Show up arrow when user reaches near the bottom
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            setShowUpArrow(true);
        } else {
            setShowUpArrow(false);
        }
    };

    if (error) {
        return <ErrorPage
            code={400}
            title='An Error Occurred!'
            description={error}
        />
    };

    return (
        reviews.length > 0 && (
            <div ref={ref} className="px-4 py-2 md:p-4">
                <div className="md:py-4">
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-900 font-bold">
                        Ratings & Reviews
                    </p>
                </div>

                <div className={`py-4 w-full flex flex-col md:flex-row justify-around items-center md:items-start gap-8 lg:gap-12 transition-opacity duration-500 ${loading ? "opacity-20" : "opacity-100"}`}>

                    {/* Left Column: Rating Stats */}
                    <div className='flex md:flex-col w-full md:w-1/2 lg:w-2/5 items-center justify-around md:justify-normal md:gap-6'>
                        <div className="flex flex-col items-center">
                            <div className="text-lg md:text-2xl lg:text-4xl font-semibold flex items-center gap-2 p-2">
                                <p>{stats.average}</p>
                                <FaStar className="text-yellow-500 w-4 h-4 md:w-6 md:h-6 lg:w-10 lg:h-10" />
                            </div>
                            <div className="text-xxs md:text-sm lg:text-sm text-gray-600">
                                Out of {stats.total} ratings
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-2/3">
                            {RatingStarsBar(stats, 5, stats.fiveStar, "bg-green-600")}
                            {RatingStarsBar(stats, 4, stats.fourStar, "bg-lime-500")}
                            {RatingStarsBar(stats, 3, stats.threeStar, "bg-yellow-400")}
                            {RatingStarsBar(stats, 2, stats.twoStar, "bg-orange-400")}
                            {RatingStarsBar(stats, 1, stats.oneStar, "bg-red-500")}
                        </div>
                    </div>

                    {/* Right Column: Reviews List */}
                    <div className='w-full md:w-1/2 lg:w-3/5 relative'>
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className='max-h-[350px] md:max-h-[500px] overflow-y-auto scrollbar-hide'
                        >
                            {reviews.map((item, index) => (
                                <div key={index} className="bg-white shadow-sm rounded-md p-4 mb-4 last:mb-0 border border-gray-200">

                                    {/* User Info */}
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <CircleUser className='w-5 h-5 md:w-7 md:h-7' />
                                        {/* <FaUserCircle size={28} /> */}
                                        <div>
                                            <p className="text-sm md:text-base font-semibold">
                                                {item.firstName} {item.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex items-center mt-2">
                                        <StarRating rating={item.rating} />
                                    </div>

                                    {/* Review Content */}
                                    <p className="text-sm md:text-base mt-2 text-gray-700 font-semibold leading-relaxed">
                                        {item.review}
                                    </p>

                                    {/* Date & Like Dislike */}
                                    <div className='mt-2 flex justify-between'>
                                        <div>
                                            <p className="text-xs md:text-sm text-gray-600">
                                                {format(parseISO(item.updatedAt), "do MMMM, yyyy")}
                                            </p>
                                        </div>

                                        <div className="flex gap-4 md:gap-6 text-xs text-gray-600">
                                            <div
                                                className={`flex items-center gap-1 md:gap-2 ${isAuthenticated && 'cursor-pointer'}`}
                                                onClick={() => handleLikeDislike(item.id, "like")}
                                            >
                                                {item?.liked
                                                    ? <AiFillLike className='w-5 h-5 md:w-6 md:h-6' />
                                                    : <AiOutlineLike className='w-5 h-5 md:w-6 md:h-6' />
                                                }
                                                {item.likes}
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 md:gap-2 ${isAuthenticated && 'cursor-pointer'}`}
                                                onClick={() => handleLikeDislike(item.id, "dislike")}
                                            >
                                                {item?.disliked
                                                    ? <AiFillDislike className='w-5 h-5 md:w-6 md:h-6' />
                                                    : <AiOutlineDislike className='w-5 h-5 md:w-6 md:h-6' />
                                                }
                                                {item.dislikes}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Down Arrow */}
                        {showDownArrow && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none z-10">
                                <div className="bg-white/90 rounded-full p-1 shadow-md animate-bounce">
                                    <ChevronsDown className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                                </div>
                            </div>
                        )}

                        {/* Up Arrow */}
                        {showUpArrow && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none z-10">
                                <div className="bg-white/90 rounded-full p-1 shadow-md animate-bounce">
                                    <ChevronsUp className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ));
})

export default ReviewSection;