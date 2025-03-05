import React, { useState } from "react";

const SortDropdown = () => {
    const [sort, setSort] = useState("default");

    const options = [
        { value: "default", label: "Default" },
        { value: "name_asc", label: "Name: A to Z" },
        { value: "name_desc", label: "Name: Z to A" },
        { value: "price_low", label: "Price: Low to High" },
        { value: "price_high", label: "Price: High to Low" },
        { value: "rating_high", label: "Rating: Highest" },
        { value: "rating_low", label: "Rating: Lowest" },
    ];

    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Sort By</span>
            <div className="relative">
                <select
                    className="px-4 py-[10px] border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SortDropdown;
