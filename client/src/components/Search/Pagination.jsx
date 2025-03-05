import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const visiblePages = 5;
    const startPage = Math.floor(currentPage / visiblePages) * visiblePages;
    const endPage = Math.min(startPage + visiblePages, totalPages);

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            {/* Left Button */}
            <button
                className={`p-2 rounded-full ${currentPage === 0
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-200"}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                <FaChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((page) => (
                <button
                    key={page}
                    className={`px-3 py-1 rounded-lg ${currentPage === page
                        ? "bg-gray-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}

            {/* Right Button */}
            <button
                className={`p-2 rounded-full ${currentPage === totalPages - 1
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                <FaChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;