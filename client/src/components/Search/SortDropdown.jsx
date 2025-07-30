import { useState, useRef, useEffect } from "react";
import { GoSortDesc } from "react-icons/go";
import { Check } from "lucide-react";

const OPTIONS = [
    { value: "default", label: "Relevance" },
    { value: "rating_high", label: "Popularity" },
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
];

import { useSearchParams } from "react-router-dom";

const DesktopSort = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const sort = searchParams.get("sort") || "default";
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        function handle(e) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [isOpen]);

    const handleSortChange = (value) => {
        if (value === "default") {
            searchParams.delete("sort");
        } else {
            searchParams.set("sort", value);
        }
        setSearchParams(searchParams);
        setIsOpen(false);
    };

    const activeLabel = OPTIONS.find((opt) => opt.value === sort)?.label || OPTIONS[0].label;

    return (
        <div className="relative hidden md:block">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <GoSortDesc className="w-6 h-6" />
                <span className="text-base font-medium text-gray-800">Sort: {activeLabel}</span>
            </button>
            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-xl z-20 py-2 animate-fadeInTop"
                    role="listbox"
                >
                    {OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            role="option"
                            aria-selected={sort === opt.value}
                            tabIndex={0}
                            className={`flex items-center justify-between w-full px-4 py-3 hover:bg-primary-50 text-gray-800 transition text-base ${sort === opt.value ? "font-semibold bg-primary-50" : ""
                                }`}
                            onClick={() => handleSortChange(opt.value)}
                        >
                            <span>{opt.label}</span>
                            {sort === opt.value && <Check className="w-4 h-4 text-primary-800" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DesktopSort;



// import React from "react";
// import { useSearchParams } from "react-router-dom";

// const SortDropdown = () => {

//     const [searchParams, setSearchParams] = useSearchParams();
//     const sort = searchParams.get("sort") || "default";

//     const OPTIONS = [
//         { value: "default", label: "Default" },
//         { value: "name_asc", label: "Name: A to Z" },
//         { value: "name_desc", label: "Name: Z to A" },
//         { value: "price_low", label: "Price: Low to High" },
//         { value: "price_high", label: "Price: High to Low" },
//         { value: "rating_high", label: "Rating: Highest" },
//         { value: "rating_low", label: "Rating: Lowest" },
//     ];

//     const handleSortChange = (e) => {
//         const newSort = e.target.value;
//         if (newSort === "default") {
//             searchParams.delete("sort");
//         } else {
//             searchParams.set("sort", newSort);
//         }
//         setSearchParams(searchParams);
//     };

//     return (
//         <div className="hidden md:flex items-center gap-2">
//             <span className="text-base font-semibold">Sort By</span>
//             <div className="relative">
//                 <select
//                     className="px-4 py-[10px] border rounded-md text-gray-700 focus:ring-2 focus:ring-gray-500 cursor-pointer"
//                     value={sort}
//                     onChange={handleSortChange}
//                 >
//                     {OPTIONS.map((option) => (
//                         <option key={option.value} value={option.value}>
//                             {option.label}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//         </div>
//     );
// };

// export default SortDropdown;