import React from 'react'
import StarRating from './StarRating';

const RatingStarsBar = (stats, stars, count, color) => {

    const getRatingPercentage = () => {
        return stats.total === 0 ? 0 : (count / stats.total) * 100;
    };

    return (
        <div className="flex items-center gap-8 text-sm">
            <div className=''>
                <StarRating rating={stars} />
            </div>
            <div className="w-1/2 relative h-2 bg-gray-200 rounded">
                <div className={`absolute top-0 left-0 h-2 rounded ${color}`} style={{ width: `${getRatingPercentage()}%` }}></div>
            </div>
            <span className="text-right text-gray-700 font-medium">{getRatingPercentage().toFixed(2)}%</span>
        </div>
    )
}

export default RatingStarsBar;