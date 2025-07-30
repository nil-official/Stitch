import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const visiblePages = 5;
    const startPage = Math.floor(currentPage / visiblePages) * visiblePages;
    const endPage = Math.min(startPage + visiblePages, totalPages);

    return (
        <div className="flex items-center justify-center gap-2 mb-4 mt-8 md:mt-12 overflow-x-auto">
            {/* Left Button */}
            <button
                className={`p-2 rounded-full ${currentPage === 0
                    ? "text-gray-300"
                    : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                <FaChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((page) => (
                <button
                    key={page}
                    className={`px-2.5 md:px-3 py-1 text-sm md:text-base rounded-lg ${currentPage === page
                        ? "bg-gray-700 text-white"
                        : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}

            {/* Right Button */}
            <button
                className={`p-2 rounded-full ${currentPage === totalPages - 1
                    ? "text-gray-300"
                    : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                <FaChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;