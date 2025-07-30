import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X } from "lucide-react";
import { GoSortDesc } from "react-icons/go";
import { VscSettings } from "react-icons/vsc";
import { NO_PRODUCT } from '../../assets/asset';
import FilterSection from '../../components/Search/FilterSection';
import ProductCard from '../../components/Search/ProductCard';
import DesktopSort from '../../components/Search/SortDropdown';
import MobileSort from '../../components/Search/MobileSort';
import Pagination from '../../components/Search/Pagination';
import ErrorEncountered from '../../components/ErrorEncountered';
import { getProducts } from '../../redux/customer/search/action';
import { getFilters } from '../../redux/customer/filter/action';

const SearchPage = () => {
    // Hooks
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux states
    const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.search);
    const { filters, filtersLoading, filtersError } = useSelector((state) => state.filter);

    // URL Search Params
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'default';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const [pageSize] = useState(12);

    // Extract filters from URL
    const initialFilters = {};
    searchParams.forEach((value, key) => {
        if (!['q', 'minPrice', 'maxPrice', 'page', 'sort'].includes(key)) {
            initialFilters[key] = value.split(',');
        }
    });

    // State for UI controls
    const [sortOpen, setSortOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(() => window.innerWidth >= 768);
    const [filterClosing, setFilterClosing] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    useEffect(() => {
        const handleResize = () => {
            setShowFilters(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Method to update URL search params
    const updateSearchParams = (filters) => {
        const newParams = new URLSearchParams();
        if (query) newParams.set('q', query);
        if (sort !== 'default') newParams.set('sort', sort);
        if (minPrice) newParams.set('minPrice', minPrice);
        if (maxPrice) newParams.set('maxPrice', maxPrice);
        Object.entries(filters).forEach(([key, values]) => {
            if (values.length > 0) {
                newParams.set(key, values.join(','));
            }
        });
        setSearchParams(newParams);
    };

    // Method to handle filter change
    const handleFilterChange = (category, value) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (updatedFilters[category]) {
                if (updatedFilters[category].includes(value)) {
                    updatedFilters[category] = updatedFilters[category].filter((item) => item !== value);
                } else {
                    updatedFilters[category].push(value);
                }
            } else {
                updatedFilters[category] = [value];
            }
            if (updatedFilters[category].length === 0) {
                delete updatedFilters[category];
            }
            updateSearchParams(updatedFilters);
            return updatedFilters;
        });
    };

    // Method to clear all filters
    const handleClearFilters = () => {
        setSelectedFilters({});
        updateSearchParams({});
    };

    // Method to toggle filters visibility
    const handleShowFilters = () => {
        if (window.innerWidth < 768 && showFilters) {
            setFilterClosing(true);
            setTimeout(() => {
                setShowFilters(false);
                setFilterClosing(false);
            }, 180);
        } else {
            setShowFilters((prev) => !prev);
        }
    };

    // Method to handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < products.totalPages && newPage !== products.number) {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set('page', newPage + 1);
                return params;
            });
        }
    };

    // Fetching filters from redux
    useEffect(() => {
        dispatch(getFilters(query));
    }, [dispatch, query]);

    // Fetching products from redux
    useEffect(() => {
        dispatch(getProducts(query, minPrice, maxPrice, selectedFilters, sort, currentPage, pageSize));
    }, [dispatch, query, minPrice, maxPrice, selectedFilters, sort, currentPage, searchParams]);

    return (
        <div className="min-h-[60vh] flex justify-center">
            <div className="w-full flex flex-col md:flex-row justify-center">
                {/* Error Section */}
                {(productsError || filtersError) ? (
                    <ErrorEncountered message={productsError.response.data.error || filtersError.response.data.error} />
                ) : (
                    <div className='w-full 2xl:w-11/12 3xl:w-3/4 flex justify-center pb-4'>

                        {/* ------------- Left Section (Filters) ------------- */}
                        {showFilters && (
                            <aside
                                className={`fixed inset-0 z-50 bg-black bg-opacity-40 flex md:relative md:z-0 md:bg-transparent 
                                    ${window.innerWidth >= 768 ? 'static w-full md:w-1/4 p-4 md:p-6' : ''}`}
                                style={{ display: window.innerWidth >= 768 ? 'block' : 'flex' }}
                                tabIndex={-1}
                                onClick={window.innerWidth < 768 ? handleShowFilters : undefined}
                            >
                                <div
                                    className={`bg-white overflow-y-auto h-full md:relative md:w-full md:max-w-none md:h-auto shadow-lg md:shadow-none p-4 md:p-0 
                                        ${window.innerWidth < 768 ? 'w-10/12 max-w-xs animate-slideInLeft' : 'w-full'} 
                                        ${filterClosing && window.innerWidth < 768 && 'animate-slideOutLeft'}`}
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* Mobile close btn */}
                                    <div className="flex items-center justify-between md:hidden mb-6">
                                        <p className='text-base font-semibold'>Filters</p>
                                        <button onClick={handleShowFilters}>
                                            <X className='w-5 h-5' />
                                        </button>
                                    </div>
                                    {/* Desktop Heading */}
                                    <p className="text-xl py-6 hidden md:block">
                                        {filtersLoading ? "Searching Filters ......" : "Filters"}
                                    </p>
                                    {/* Filter Box (use min-h on desktop only) */}
                                    <div className="border rounded-lg p-4 md:p-6 md:min-h-[60vh]">
                                        {filtersLoading ? (
                                            <div className="flex justify-center items-center min-h-[40vh]">
                                                <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
                                            </div>
                                        ) : filters && (
                                            <FilterSection filters={filters} selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
                                        )}
                                    </div>
                                </div>
                            </aside>
                        )}

                        {/* ------------- Right Section (Products) ------------- */}
                        <div className="w-full md:w-3/4 p-1 md:p-6">
                            {/* Product Search Heading */}
                            <p className='text-base md:text-lg lg:text-xl px-4 pt-4 pb-2 md:px-0 md:py-6'>
                                {productsLoading ? (
                                    `Searching for: "${query}".......`
                                ) : (products && products.empty ? (
                                    `No results found for: "${query}"`
                                ) : (
                                    `Showing ${products?.number * products?.size + 1} - ${Math.min((products?.number + 1) * products?.size, products?.totalElements)} of ${products?.totalElements} results for: "${query}"`
                                ))}
                            </p>

                            {/* Product Box */}
                            <div className={`md:border rounded-lg p-2 md:p-6 lg:p-8 min-h-[70vh] flex flex-col items-center ${productsLoading ? 'justify-center' : 'justify-between'}`}>
                                {productsLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
                                    </div>
                                ) : (products && products.content.length > 0 ? (
                                    <div className='flex flex-col justify-between items-center h-full'>

                                        {/* Filters Showing & Sort Section */}
                                        <div className="pb-2 md:pb-6 flex items-center w-full">
                                            {Object.keys(selectedFilters).length > 0 && (
                                                <div className="hidden flex-1 gap-2 md:flex flex-wrap items-center">
                                                    <button onClick={handleClearFilters} className="p-2 flex items-center gap-1 border rounded-xl">
                                                        <X size={20} />Clear filters
                                                    </button>
                                                    {Object.entries(selectedFilters)
                                                        .filter(([key]) => key !== "minPrice" && key !== "maxPrice")
                                                        .map(([key, values]) => values.map((value) => {
                                                            const formattedValue = key === "discount"
                                                                ? `${value}% and above`
                                                                : key === "rating"
                                                                    ? `${value} star and above`
                                                                    : value;
                                                            return (
                                                                <button
                                                                    key={`${key}-${value}`}
                                                                    onClick={() => handleFilterChange(key, value)}
                                                                    className="p-2 flex items-center gap-1 border rounded-xl"
                                                                >
                                                                    <X size={20} />{formattedValue}
                                                                </button>
                                                            );
                                                        }))}
                                                </div>
                                            )}

                                            <div className="ml-auto pl-4 flex items-center gap-4">
                                                <button
                                                    className={`flex items-center gap-2 p-2 md:px-4 md:py-2 rounded-md md:border border-gray-300
                                                        ${window.innerWidth > 768 && !showFilters && 'text-gray-400'}`}
                                                    onClick={handleShowFilters}
                                                >
                                                    <VscSettings className='w-5 h-5 md:w-6 md:h-6' />
                                                    <span className="text-base font-medium">Filters</span>
                                                </button>

                                                <button
                                                    className="flex items-center gap-2 p-2 md:hidden"
                                                    onClick={() => setSortOpen(true)}
                                                >
                                                    <GoSortDesc className='w-5 h-5' />
                                                    <span className="text-base font-medium">Sort</span>
                                                </button>

                                                <MobileSort open={sortOpen} onClose={() => setSortOpen(false)} />

                                                <DesktopSort />
                                            </div>
                                        </div>

                                        {/* Product List */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
                                            {products.content.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {products.totalPages > 1 && (
                                            <Pagination
                                                currentPage={products.number}
                                                totalPages={products.totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        )}
                                    </div>
                                ) : (products && products.empty && (
                                    <div className="flex flex-col items-center justify-center w-3/4 text-center rounded-lg p-6">
                                        <img
                                            src={NO_PRODUCT}
                                            alt="No Product Found!"
                                            className="w-52 object-contain"
                                        />
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            No Product Found!
                                        </h2>
                                        <p className="text-gray-500 mb-10">
                                            We couldn't find any products matching your search. Please try again with different keywords or browse our latest collections.
                                        </p>
                                        <button
                                            className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700"
                                            onClick={() => navigate('/products/search')}
                                        >
                                            Search Now
                                        </button>
                                    </div>
                                )))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default SearchPage;