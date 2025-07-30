import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";

const OPTIONS = [
    { value: "default", label: "Relevance" },
    { value: "rating_high", label: "Popularity" },
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
];

const MobileSort = ({ open, onClose }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sort = searchParams.get("sort") || "default";
    const backdropRef = useRef(null);
    const [closing, setClosing] = useState(false);
    const [innerOpen, setInnerOpen] = useState(false);

    // Show when open turns true, hide after animation on close
    useEffect(() => {
        if (open) {
            setInnerOpen(true);
        } else if (innerOpen) {
            setClosing(true);
            setTimeout(() => {
                setInnerOpen(false);
                setClosing(false);
            }, 180);
        }
    }, [open]);

    // Handle outside click
    useEffect(() => {
        if (!innerOpen) return;
        function handleClickOutside(e) {
            if (backdropRef.current && e.target === backdropRef.current) {
                triggerClose();
            }
        }
        window.addEventListener("mousedown", handleClickOutside);
        return () =>
            window.removeEventListener("mousedown", handleClickOutside);
    }, [innerOpen]);

    // Lock scroll when open
    useEffect(() => {
        if (innerOpen && !closing) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [innerOpen, closing]);

    // Unified close handler (for animation)
    const triggerClose = () => {
        setClosing(true);
        setTimeout(() => {
            setClosing(false);
            setInnerOpen(false);
            onClose();
        }, 180);
    };

    const handleSortChange = (value) => {
        if (value === "default") {
            searchParams.delete("sort");
        } else {
            searchParams.set("sort", value);
        }
        setSearchParams(searchParams);
        triggerClose();
    };

    // Only render if open or currently closing
    if (!innerOpen) return null;

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-30 bg-black bg-opacity-40 flex items-end md:hidden"
            tabIndex={-1}
        >
            <div
                className={`w-full bg-white rounded-t-2xl p-4 shadow-2xl ${closing ? "animate-slideDown" : "animate-slideUp"
                    }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-semibold">Sort By</span>
                    <button
                        onClick={triggerClose}
                        className="p-1 rounded-md hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div>
                    {OPTIONS.map((opt) => (
                        <label
                            key={opt.value}
                            className="flex items-center py-3 px-2 cursor-pointer border-b last:border-b-0"
                        >
                            <input
                                type="radio"
                                name="sort"
                                value={opt.value}
                                checked={sort === opt.value}
                                onChange={() => handleSortChange(opt.value)}
                                className="accent-primary-800 w-4 h-4 mr-4"
                            />
                            <span className="text-sm">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileSort;