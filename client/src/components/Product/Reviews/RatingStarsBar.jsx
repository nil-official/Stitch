import StarRating from "./StarRating";

const RatingStarsBar = (stats, stars, count, color) => {

    const getRatingPercentage = () => {
        return stats.total === 0 ? 0 : (count / stats.total) * 100;
    };

    return (
        <div className="flex justify-between items-center gap-2 md:gap-3 text-sm">
            <div className='mr-1'>
                <StarRating rating={stars} />
            </div>
            <div className="w-1/2 relative h-1 md:h-1.5 lg:h-2 bg-gray-200 rounded">
                <div className={`absolute top-0 left-0 h-1 md:h-1.5 lg:h-2 rounded ${color}`} style={{ width: `${getRatingPercentage()}%` }}></div>
            </div>
            <span className="text-xs md:text-sm lg:text-base text-right text-gray-700 font-medium min-w-12 md:min-w-14 lg:min-w-16">{getRatingPercentage().toFixed(2)}%</span>
        </div>
    );
};

export default RatingStarsBar;