import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import decodeJWT from '../../utils/decodeJWT';
import { toast } from 'react-hot-toast';
import ProductRow from '../../components/Admin/ProductRow';
import BASE_URL from '../../utils/baseurl';
import { AUTH_ROUTES } from '../../routes/routePaths';

const AdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination state
    const [pageNumber, setPageNumber] = useState(0);  // Start at page 1
    const [pageSize, setPageSize] = useState(10);  // Number of products per page
    
    const API_URL = `${BASE_URL}/api/admin/products/all?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    // Verify admin access
    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
            if (!authorities.includes("ROLE_ADMIN")) {
                navigate(AUTH_ROUTES.LOGIN);
            }
        } else {
            navigate(AUTH_ROUTES.LOGIN);
        }
    }, [navigate]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            setProducts(response.data?.content || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [pageNumber, pageSize]);

    const editProduct = (id) => {
        const product = products.find((product) => product.id === id);
        navigate('/admin/products/edit', { state: { product } });
    };

    const deleteProduct = (id) => {
        setProducts(products.filter((product) => product.id !== id));
        axios
            .delete(`${BASE_URL}/api/admin/products/${id}/delete`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            })
            .then(() => toast.success('Product deleted successfully.'))
            .catch((error) => {
                console.error('Error deleting product:', error);
                toast.error('Error deleting product. Please try again.');
            });
    };

    const handleNextPage = () => {
        if (products.length < pageSize) return;
        setPageNumber(prevPage => prevPage + 1);  // Increment page number to go to the next page
    };

    const handlePrevPage = () => {
        setPageNumber(prevPage => Math.max(prevPage - 1, 0));  // Decrement page number, but not below 1
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
                <p className="text-gray-600 mt-1">Showing {pageSize} results. Page: {pageNumber + 1}</p>
            </div>
            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-gray-500 text-center">Loading products...</p>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductRow
                            key={product.id}
                            product={product}
                            onEdit={() => editProduct(product.id)}
                            onDelete={() => deleteProduct(product.id)}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No products found.</p>
                )}
            </div>
            <div className="flex justify-between mt-6">
                <button onClick={handlePrevPage} disabled={pageNumber === 0} className='px-4 py-2 bg-gray-50 text-sm font-semibold shadow rounded-lg text-black-600 hover:text-black-800 hover:shadow-lg hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition'>
                    Previous</button>
                <button onClick={handleNextPage} disabled={products.length < pageSize} className='px-4 py-2 bg-gray-50 text-sm font-semibold shadow rounded-lg text-black-600 hover:text-black-800 hover:shadow-lg hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition'>
                    Next</button>
            </div>
        </div>
    );
};

export default AdminProducts;
