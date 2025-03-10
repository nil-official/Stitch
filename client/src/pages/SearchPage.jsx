import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Settings2 } from "lucide-react";
import FilterSection from '../components/Search/FilterSection';
import SortDropdown from '../components/Search/SortDropdown';
import ProductCard from '../components/Search/ProductCard';
import Pagination from '../components/Search/Pagination';
import ErrorEncountered from '../components/ErrorEncountered';
import { getProducts } from '../redux/customer/search/searchProductsActions';
import { getFilters } from '../redux/customer/search/searchFiltersActions';

const SearchPage = () => {
    // Hooks
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux states
    const { products, productsLoading, productsError } = useSelector((state) => state.searchProductsState);
    const { filters, filtersLoading, filtersError } = useSelector((state) => state.searchFiltersState);

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
    const [showFilters, setShowFilters] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

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
        setShowFilters((prev) => !prev);
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
            <div className="w-full flex justify-center">
                {/* Error Section */}
                {(productsError || filtersError) ? (
                    <ErrorEncountered message={productsError.response.data.error || filtersError.response.data.error} />
                ) : (
                    <div className='w-full 2xl:w-11/12 3xl:w-3/4 flex justify-center pb-4'>
                        
                        {/* ------------- Left Section (Filters) ------------- */}
                        <div className="w-1/4 p-6">
                            {/* Filter Search Heading */}
                            <p className='text-xl py-6'>
                                {filtersLoading ? (
                                    `Searching Filters ......`
                                ) : (
                                    `Filters`
                                )}
                            </p>

                            {/* Filter Box */}
                            <div className="border rounded-lg p-6">
                                {filtersLoading ? (
                                    <div className="flex justify-center items-center min-h-[65vh]">
                                        <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
                                    </div>
                                ) : (filters && showFilters && (
                                    <FilterSection filters={filters} selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
                                ))}
                            </div>
                        </div>

                        {/* ------------- Right Section (Products) ------------- */}
                        <div className="w-3/4 p-6">
                            {/* Product Search Heading */}
                            <p className='text-xl py-6'>
                                {productsLoading ? (
                                    `Searching for: "${query}".......`
                                ) : (products && products.empty ? (
                                    `No results found for: "${query}"`
                                ) : (
                                    `Showing ${products?.number * products?.size + 1} - ${Math.min((products?.number + 1) * products?.size, products?.totalElements)} of ${products?.totalElements} results for: "${query}"`
                                ))}
                            </p>

                            {/* Product Box */}
                            <div className={`border rounded-lg p-8 min-h-[70vh] flex flex-col items-center ${productsLoading ? 'justify-center' : 'justify-between'}`}>
                                {productsLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
                                    </div>
                                ) : (products && products.content.length > 0 ? (
                                    <div className='flex flex-col justify-between items-center h-full'>

                                        {/* Filters Showing & Sort Section */}
                                        <div className="pb-6 flex items-center w-full">
                                            {Object.keys(selectedFilters).length > 0 && (
                                                <div className="flex-1 gap-2 flex flex-wrap items-center">
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
                                                <Settings2
                                                    size={24}
                                                    className={`${showFilters ? 'text-gray-600' : 'text-gray-400'} cursor-pointer`}
                                                    onClick={handleShowFilters}
                                                />
                                                <SortDropdown />
                                            </div>
                                        </div>

                                        {/* Product List */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                            src="/no-product-found.jpg"
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
        </div>
    );
};

export default SearchPage;