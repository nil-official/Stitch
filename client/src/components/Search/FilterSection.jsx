import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import PriceSlider from "./PriceSlider";

const FilterSection = ({ filters, selectedFilters, onFilterChange }) => {
    // Extract current URL location
    const location = useLocation();
    const [openCategories, setOpenCategories] = useState({});

    // Extract filter categories from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const initialOpenCategories = {};
        // Iterate over all filter categories
        Object.keys(filters || {}).forEach(category => {
            if (params.has(category)) {
                initialOpenCategories[category] = true;
            }
        });
        setOpenCategories(initialOpenCategories);
    }, [location.search, filters]);

    // Toggle visibility of filter categories
    const toggleCategory = (key) => {
        setOpenCategories((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        Object.entries(filters).map(([category, values], index, array) => category === "price" ? (
            <div key={category} className="mb-2 pb-2 md:mb-4 md:pb-4 border-b">
                {/* Price Filter */}
                <h3 className="mb-2 text-sm md:text-base">Price</h3>
                <PriceSlider
                    min={values.minPrice}
                    max={values.maxPrice}
                    selectedPrice={{
                        minPrice: selectedFilters.minPrice || values.minPrice,
                        maxPrice: selectedFilters.maxPrice || values.maxPrice,
                    }}
                />
            </div>
        ) : (
            <div
                key={category}
                className={index !== array.length - 1 ? "mb-2 pb-2 md:mb-4 md:pb-4 border-b" : ""}
            >
                <div
                    className="flex items-center justify-between cursor-pointer py-2"
                    onClick={() => toggleCategory(category)}
                >
                    <h3 className="text-sm md:text-base">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <FaChevronDown
                        className={`w-3 h-3 md:w-4 md:h-4 text-gray-700 transition-transform ${openCategories[category] ? "rotate-180" : ""}`}
                    />
                </div>

                {/* Category Options */}
                {openCategories[category] && (
                    <ul className="py-1 md:py-2 space-y-2">
                        {values.map(({ name, count }) => {
                            // Formatting discount and rating categories
                            const isNumericCategory = category === "discount" || category === "rating";
                            let formattedName = isNumericCategory
                                ? category === "discount"
                                    ? `${name}% and above`
                                    : `${name} star and above`
                                : name;

                            // Remove 'T' from the beginning of the category is "size"
                            if (category === "size" && String(name).startsWith("T")) {
                                formattedName = String(name).substring(1);
                            }

                            // Check if the current option is selected
                            const isChecked = selectedFilters[category]?.some(
                                (selected) => String(selected).toLowerCase() === String(name).toLowerCase()
                            ) ?? false;

                            return (
                                <li key={name} className="flex items-center text-xs md:text-sm">
                                    <label className="flex gap-2 cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => onFilterChange(category, String(name))}
                                            className="accent-gray-600 cursor-pointer"
                                        />
                                        <span>{formattedName}</span>
                                        <span>({count})</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        ))
    );
};

export default FilterSection;