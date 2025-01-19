import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import decodeJWT from '../utils/decodeJWT';
import { toast } from 'react-toastify';
import ProductRow from '../components/Admin/ProductRow';
import BASE_URL from '../utils/baseurl';

const AdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = `${BASE_URL}/api/admin/products/all?pageNumber=1&pageSize=10`;

    // Verify admin access
    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
            if (!authorities.includes("ROLE_ADMIN")) {
                navigate('/login');
            }
        } else {
            navigate('/login');
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
    }, []);

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

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
                <p className="text-gray-600 mt-1">Manage products by editing or deleting them below.</p>
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
        </div>
    );
};

export default AdminProducts;
