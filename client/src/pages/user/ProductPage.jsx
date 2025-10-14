import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import ReviewSection from '../../components/Product/Reviews/ReviewSection';
import ProductSection from '../../components/Product/ProductSection';
import LazyProductSection from '../../components/Product/LazyProductSection';
import { getLikeProducts, getSimilarProducts, clearSimilarProducts, clearLikeProducts } from '../../redux/customer/product/action';

const ProductPage = () => {
    const dispatch = useDispatch();
    const { slug, id } = useParams();
    const reviewSectionRef = useRef(null);

    const [similarPage, setSimilarPage] = useState(0);
    const [likePage, setLikePage] = useState(0);
    const { similarProducts, likeProducts } = useSelector((state) => state.product);

    useEffect(() => {
        setSimilarPage(0);
        setLikePage(0);
        dispatch(clearSimilarProducts());
        dispatch(clearLikeProducts());
        dispatch(getSimilarProducts(id, 1, 10));
        dispatch(getLikeProducts(id, 1, 10));
    }, [id, dispatch]);

    const scrollToReviews = () => {
        reviewSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMoreSimilar = () => {
        if (similarProducts.last) return;
        setSimilarPage((p) => p + 1);
        dispatch(getSimilarProducts(id, similarPage + 1, 10));
    };

    const fetchMoreLike = () => {
        if (likeProducts.last) return;
        setLikePage((p) => p + 1);
        dispatch(getLikeProducts(id, likePage + 1, 10));
    };

    return (
        <div className="max-w-7xl mx-auto md:py-8 md:px-6 min-h-[50vh]">
            <ProductSection
                productId={id}
                scrollToReviews={scrollToReviews}
            />

            <ReviewSection
                productId={id}
                ref={reviewSectionRef}
            />

            <LazyProductSection
                title="Similar Products"
                products={similarProducts.content}
                loading={similarProducts.loading}
                fetchMore={fetchMoreSimilar}
                stopLoading={similarProducts.last}
                fetched={similarProducts.fetched}
            />
            <LazyProductSection
                title="You May Also Like"
                products={likeProducts.content}
                loading={likeProducts.loading}
                fetchMore={fetchMoreLike}
                stopLoading={likeProducts.last}
                fetched={likeProducts.fetched}
            />
        </div>
    );
};

export default ProductPage;