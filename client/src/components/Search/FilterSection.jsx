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

    return (
        <div className="w-1/4 p-6">
            <h2 className="text-xl py-6">Filters</h2>
            <div className="border rounded-lg p-6">
                {/* Iterate over Filters */}
                {!filters ? (
                    <p>No filters found</p>
                ) : (Object.entries(filters).map(([category, values], index, array) =>
                    category !== "price" ? (
                        <div
                            key={category}
                            className={index !== array.length - 1 ? "mb-4 pb-4 border-b" : ""}
                        >
                            {/* Category Header with Toggle Button */}
                            <div
                                className="flex items-center justify-between cursor-pointer py-2"
                                onClick={() => toggleCategory(category)} // Toggle visibility on click
                            >
                                <h3 className="">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </h3>
                                <FaChevronDown
                                    className={`text-gray-600 transition-transform ${openCategories[category] ? "rotate-180" : ""}`}
                                />
                            </div>

                            {/* Category Options (Conditionally Rendered) */}
                            {openCategories[category] && (
                                <ul className="py-2 space-y-2">
                                    {values.map(({ name, count }) => {
                                        // Convert `name` to a string for UI display but keep the raw value for comparison
                                        const isNumericCategory = category === "discount" || category === "rating";
                                        const formattedName = isNumericCategory
                                            ? category === "discount"
                                                ? `${name}% and above`
                                                : `${name} star and above`
                                            : name;

                                        // Ensure we check against the raw `name` value, not the formatted one
                                        const isChecked = selectedFilters[category]?.includes(String(name)) ?? false;

                                        return (
                                            <li key={name} className="flex items-center">
                                                <label className="flex gap-2 cursor-pointer">
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
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default FilterSection;