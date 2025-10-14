import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import Loader from "../Loader";

const LazyProductSection = ({ title, products, loading, fetchMore, stopLoading, fetched }) => {
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);
    const [visible, setVisible] = useState(false);

    // 🔹 Trigger visibility once section is in viewport
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !visible) {
                setVisible(true);
            }
        }, { threshold: 0.1 });

        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [visible]);

    // 🔹 Infinite scroll observer (only when visible and not stopped)
    useEffect(() => {
        if (!visible || stopLoading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                fetchMore(); // call parent handler
            }
            // }, { threshold: 1 });
        }, { threshold: 0, rootMargin: "300px" });

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [visible, loading, stopLoading, fetchMore]);

    // 🔹 Skip rendering only after loading finished and products are empty
    if (fetched && !loading && (!products || products.length === 0)) {
        return null;
    };

    return (
        <div ref={observerRef} className="px-4 py-2 md:p-4">
            {visible && (
                <div className="relative">
                    <div className="md:py-4">
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-900 font-bold">{title}</p>
                    </div>

                    <div className="py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>

                    <div ref={loadMoreRef} className="flex items-center justify-center">
                        {loading && <Loader />}
                        {/* {stopLoading && <span className="text-gray-400">No more products</span>} */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LazyProductSection;