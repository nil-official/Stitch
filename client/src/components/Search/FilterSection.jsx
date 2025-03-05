import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const FilterSection = ({ filters, selectedFilters, onFilterChange }) => {
    const location = useLocation();
    const [openCategories, setOpenCategories] = useState({});

    // Extract filter categories from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const initialOpenCategories = {};

        // Iterate over all filter categories
        Object.keys(filters || {}).forEach(category => {
            if (params.has(category)) {
                initialOpenCategories[category] = true; // Open categories that exist in the URL
            }
        });

        setOpenCategories(initialOpenCategories);
    }, [location.search, filters]);

    const toggleCategory = (key) => {
        setOpenCategories((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    console.log("FilterSection rendered");
    

    return (
        <div className="w-1/4 p-6">
            <h2 className="text-xl py-6">Filters</h2>
            <div className="border rounded-lg p-6">
                {/* Iterate over Filters */}
                {!filters ? (
                    <p>No filters found</p>
                ) : (
                    Object.entries(filters).map(([category, values]) =>
                        category !== "price" ? (
                            <div key={category} className="mb-4 border-b">
                                {/* Category Header with Toggle Button */}
                                <div
                                    className="flex items-center justify-between cursor-pointer py-2"
                                    onClick={() => toggleCategory(category)} // Toggle visibility on click
                                >
                                    <h3 className="">
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </h3>
                                    <FaChevronDown
                                        className={`text-gray-600 transition-transform 
                                            ${openCategories[category] ? "rotate-180" : ""}`}
                                    />
                                </div>

                                {/* Category Options (Conditionally Rendered) */}
                                {openCategories[category] && (
                                    <ul className="mb-4 space-y-2">
                                        {values.map(({ name, count }) => (
                                            <li key={name} className="flex justify-between">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[category]?.includes(name)}
                                                    onChange={() => onFilterChange(category, name)}
                                                    className="accent-gray-600 cursor-pointer"
                                                />
                                                <label className="cursor-pointer">{name} ({count})</label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : null
                    )
                )}
            </div>
        </div>
    );
};

export default FilterSection;