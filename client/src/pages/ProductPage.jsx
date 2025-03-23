import React, { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import ReviewSection from '../components/Product/ReviewSection';
import ProductSection from '../components/Product/ProductSection';
import LikeProductsSection from '../components/Product/LikeProductsSection';
import SimilarProductsSection from '../components/Product/SimilarProductsSection';
import axios from '../utils/axiosConfig';

const ProductPage = () => {

    const { id } = useParams();
    const [singleProduct, setSingleProduct] = useState({});
    const [rating, setRating] = useState(0);
    const [similarProducts, setSimilarProducts] = useState([]);
    const reviewSectionRef = useRef(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const [productRes, ratingRes] = await Promise.all([
                    axios.get(`/api/products/id/${id}`),
                    axios.get(`/api/ratings/product/${id}`)
                ]);

                if (productRes.data && ratingRes.data) {
                    setSingleProduct(productRes.data);
                    setRating(ratingRes.data.averageRating);
                    fetchSimilarProducts(productRes.data.category.name, productRes.data.title);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProductDetails();
    }, [id]);

    const fetchSimilarProducts = async (category, title) => {
        try {
            const res = await axios.get(`/api/products/search/category?category=${category}&pageNumber=${0}&pageSize=${100}`);
            if (res.data) {
                const similar = res.data.content;
                setSimilarProducts(similar);
            }
        } catch (err) {
            console.error("Error fetching similar products:", err);
        }
    };

    if (!singleProduct.id) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const scrollToReviews = () => {
        reviewSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

            <ProductSection
                product={singleProduct}
                scrollToReviews={scrollToReviews}
            />

            <SimilarProductsSection
                productId={id}
            />

            <LikeProductsSection
                productId={id}
            />

            <ReviewSection
                ref={reviewSectionRef}
                productId={id}
            />

        </div>
    );
};

export default ProductPage;