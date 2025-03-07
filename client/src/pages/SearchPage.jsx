import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Settings2 } from "lucide-react";
import FilterSection from '../components/Search/FilterSection';
import SortDropdown from '../components/Search/SortDropdown';
import ProductCard from '../components/Search/ProductCard';
import Pagination from '../components/Search/Pagination';
import { getProducts } from '../redux/customer/search/searchProductsActions';
import { getFilters } from '../redux/customer/search/searchFiltersActions';

const SearchPage = () => {
    const dispatch = useDispatch();

    const { products, productsLoading, productsError } = useSelector((state) => state.searchProductsState);
    const [isProductsFetched, setIsProductsFetched] = useState(false);

    const { filters, filtersLoading, filtersError } = useSelector((state) => state.searchFiltersState);
    const [isFiltersFetched, setIsFiltersFetched] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || "";
    const sort = searchParams.get("sort") || "default";
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const [pageSize, setPageSize] = useState(12);

    const initialFilters = {};
    searchParams.forEach((value, key) => {
        if (key !== "q" && key !== "page" && key !== "sort") {
            initialFilters[key] = value.split(",");
        }
    });

    const [showFilters, setShowFilters] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    const updateSearchParams = (filters) => {
        const newParams = new URLSearchParams();
        if (query) newParams.set("q", query);
        if (sort && sort !== "default") newParams.set("sort", sort);
        Object.entries(filters).forEach(([key, values]) => {
            if (values.length > 0) {
                newParams.set(key, values.join(","));
            }
        });
        setSearchParams(newParams);
    };

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

    const handleClearFilters = () => {
        setSelectedFilters({});
        updateSearchParams({});
    };

    const handleShowFilters = () => {
        setShowFilters((prev) => !prev);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < products.totalPages && newPage !== products.number) {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set("page", newPage + 1);
                return params;
            });
        }
    };

    useEffect(() => {
        dispatch(getProducts(query, selectedFilters, sort, currentPage, pageSize)).then(() => {
            setIsProductsFetched(true);
        });
        dispatch(getFilters(query)).then(() => {
            setIsFiltersFetched(true);
        });
    }, [dispatch, query, selectedFilters, sort, currentPage, searchParams]);

    return (
        <div className="min-h-[60vh] flex justify-center">
            <div className="w-full flex justify-center">
                {productsLoading || filtersLoading || !isProductsFetched || !isFiltersFetched ? (
                    <div className="flex justify-center items-center min-h-[100vh]">
                        <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : (products.empty ? (
                    <p>No products found!</p>
                ) : (
                    <div className='w-full 2xl:w-11/12 3xl:w-3/4 flex justify-center'>
                        {/* Filter Section */}
                        {showFilters && (
                            <FilterSection filters={filters} selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
                        )}

                        {/* Product Section */}
                        <div className="w-3/4 p-6">
                            {/* Search Query */}
                            <p className='text-xl py-6'>
                                {products.empty ? (
                                    `No results found for: "${query}"`
                                ) : (
                                    `Showing ${products.number * products.size + 1} - ${Math.min((products.number + 1) * products.size, products.totalElements)} of ${products.totalElements} results for: "${query}"`
                                )}
                            </p>

                            <div className='border rounded-lg p-8 min-h-[80vh] flex flex-col justify-between'>
                                <div className='flex flex-col'>
                                    <div className="pb-6 flex items-center w-full">
                                        {/* Selected Filters */}
                                        {Object.keys(selectedFilters).length > 0 && (
                                            <div className="flex-1 gap-2 flex flex-wrap items-center">
                                                <button onClick={handleClearFilters} className="p-2 flex items-center gap-1 border rounded-xl">
                                                    <X size={20} />Clear filters
                                                </button>
                                                {Object.entries(selectedFilters).map(([key, values]) =>
                                                    values.map((value) => {
                                                        let displayValue = value;
                                                        if (key === "discount") {
                                                            displayValue = `${value}% and above`;
                                                        } else if (key === "rating") {
                                                            displayValue = `${value} star and above`;
                                                        }
                                                        return (
                                                            <button
                                                                key={`${key}-${value}`}
                                                                onClick={() => handleFilterChange(key, value)}
                                                                className="p-2 flex items-center gap-1 border rounded-xl"
                                                            >
                                                                <X size={20} />{displayValue}
                                                            </button>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        )}

                                        {/* Sort Options */}
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
                                        {products.content.length === 0 ? (
                                            <p className="text-center text-lg">No products found!</p>
                                        ) : (
                                            products.content.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Pagination */}
                                <Pagination
                                    currentPage={products.number}
                                    totalPages={products.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;