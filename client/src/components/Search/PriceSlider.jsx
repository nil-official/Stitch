import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactSlider from "react-slider";

const PriceSlider = ({ min, max, selectedPrice }) => {
    // Extract price filter from URL query parameters
    const [searchParams, setSearchParams] = useSearchParams();
    const urlMin = searchParams.get("minPrice");
    const urlMax = searchParams.get("maxPrice");
    const minPrice = urlMin !== "" && Number(urlMin) !== 0 ? Number(urlMin) : min;
    const maxPrice = urlMax !== "" && Number(urlMax) !== 0 ? Number(urlMax) : max;

    // Local state for the price range (only updates when user confirms)
    const [tempRange, setTempRange] = useState([minPrice, maxPrice]);

    // Handle slider movement (updates temporary state)
    const handleSliderChange = (newValues) => {
        setTempRange(newValues);
    };

    // Apply filter when clicking "Apply Filter"
    const applyFilter = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (tempRange[0] === min) {
            newSearchParams.delete("minPrice");
        } else {
            newSearchParams.set("minPrice", tempRange[0]);
        }
        if (tempRange[1] === max) {
            newSearchParams.delete("maxPrice");
        } else {
            newSearchParams.set("maxPrice", tempRange[1]);
        }
        setSearchParams(newSearchParams);
    };

    return (
        <div className="w-full py-2">
            {/* React Slider */}
            <ReactSlider
                className="relative w-full h-1 md:h-2 bg-gray-400 rounded-full cursor-pointer"
                thumbClassName="bg-gray-600 w-4 h-4 md:w-5 md:h-5 top-[-6px] bg-blue-600 rounded-full border-2 border-white shadow-md focus:outline-none"
                trackClassName="bg-gray-600"
                value={tempRange}
                min={min}
                max={max}
                onChange={handleSliderChange}
                minDistance={1}
                pearling
            />

            {/* Price Labels & apply button */}
            <div className="flex justify-between items-center pt-4 md:pt-6">
                <div className="text-xs md:text-sm">
                    <span>Range: INR {tempRange[0]} - INR {tempRange[1]}</span>
                </div>
                <button
                    className={`px-2 py-1.5 md:px-3 md:py-2 font-medium text-xs md:text-sm rounded-lg transition text-white ${JSON.stringify(tempRange) === JSON.stringify([minPrice, maxPrice])
                        ? "bg-gray-300"
                        : "bg-gray-600 hover:bg-gray-700"}`
                    }
                    onClick={applyFilter}
                    disabled={JSON.stringify(tempRange) === JSON.stringify([minPrice, maxPrice])}
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default PriceSlider;