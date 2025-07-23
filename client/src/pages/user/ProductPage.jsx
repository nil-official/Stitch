import { useRef } from 'react';
import { useParams } from "react-router-dom";
import ReviewSection from '../../components/Product/ReviewSection';
import ProductSection from '../../components/Product/ProductSection';
import LikeProductsSection from '../../components/Product/LikeProductsSection';
import SimilarProductsSection from '../../components/Product/SimilarProductsSection';

const ProductPage = () => {

    const { id } = useParams();
    const reviewSectionRef = useRef(null);

    const scrollToReviews = () => {
        reviewSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <ProductSection productId={id} scrollToReviews={scrollToReviews} />
            <SimilarProductsSection productId={id} />
            <LikeProductsSection productId={id} />
            <ReviewSection productId={id} ref={reviewSectionRef} />
        </div>
    );
};

export default ProductPage;