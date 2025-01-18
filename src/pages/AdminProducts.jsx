import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import decodeJWT from '../utils/decodeJWT';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const AdminProducts = () => {

    const navigate = useNavigate();

    // check if the user is an admin
    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
            if (authorities.includes("ROLE_ADMIN")) {
                navigate('/admin/products');
            } else {
                navigate('/Log');
            }
        } else
            navigate('/Log');
    }, [navigate])

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = "http://localhost:5454/api/admin/products/all?pageNumber=1&pageSize=10";

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })

            if (response.data) {
                setProducts(response.data.content);
            } else {
                console.error('Unexpected response format:', response.data)
                toast.error('Error fetching products. Please try again.')
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Error fetching products. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const editProduct = (id) => {
        // pass the product object to the page
        const product = products.find(product => product.id === id);
        navigate('/admin/products/edit', {state: { product }});
    }

    const deleteProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
        console.log(id)
        // send delete request to API
        axios.delete(`http://localhost:5454/api/admin/products/${id}/delete`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        })
        .then(response => {
            console.log(response)
            toast.success('Product deleted successfully.')
        })
        .catch(error => {
            console.error('Error deleting product:', error)
            toast.error('Error deleting product. Please try again.')
        }
        )
    };


    return (
        <>
            <div className="mx-12 sm:mx-24 md:mx-40 lg:mx-48 xl:mx-80">
                <div className="space-y-12">
                <div></div>
                <div className="pb-4">
                <h2 className="text-4xl font-semibold text-gray-900">All Products</h2>
                <p className="mt-1 text-sm/6 text-gray-600">Edit or delete products from the buttons</p>
                </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Product Title</th>
                                    {/* <th scope="col" className="px-6 py-3">Color</th> */}
                                    <th scope="col" className="px-6 py-3">Brand</th>
                                    <th scope="col" className="px-6 py-3">Price</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="odd:bg-white even:bg-gray-50 border-b">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{product.title}</th>
                                        {/* <td className="px-6 py-4">{product.color}</td> */}
                                        <td className="px-6 py-4">{product.brand}</td>
                                        <td className="px-6 py-4">₹{product.price}</td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            <button onClick={() => editProduct(product.id)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                            <button onClick={() => deleteProduct(product.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </>
    )
}

export default AdminProducts