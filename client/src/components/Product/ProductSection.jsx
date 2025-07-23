import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import ErrorPage from '../../pages/ErrorPage';
import ImageCarousel from './ImageCarousel'
import StarRating from './StarRating';
import { addToCart } from '../../redux/customer/cart/action';
import { getProfile } from '../../redux/customer/profile/action';
import { getProduct } from '../../redux/customer/product/action';
import { Loader2Icon, PencilRuler } from 'lucide-react';

const ProductSection = ({ productId, scrollToReviews }) => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    const { profile } = useSelector((state) => state.profile);
    const { product, loading, error } = useSelector((state) => state.product);

    const [size, setSize] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [quantity, setQuantity] = useState(1);
    const isOutOfStock = product.quantity === 0 || false;

    useEffect(() => {
        if (productId) dispatch(getProduct(productId));
    }, [dispatch, productId]);

    useEffect(() => {
        if (isAuthenticated && !profile) dispatch(getProfile());
    }, [isAuthenticated, profile, dispatch]);

    const isRecommendedSize = (sizeName) => {
        return profile?.predictedSizes?.includes(sizeName);
    };

    const getRecommendedSize = () => {
        const recommendedSizes = profile?.predictedSizes?.filter(size => product?.sizes?.map(s => s.name).includes(size));
        return recommendedSizes?.length > 0 ? recommendedSizes.join(', ') : null;
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value > 5) {
            toast.error("Maximum five units allowed per item.");
        }
        else if (value !== '' && value !== 0) {
            setQuantity(parseInt(value));
        }
    };

    const handleAddToCart = (productId, size, quantity) => {
        if (!isAuthenticated) {
            toast.error("Please login first.");
            return;
        }
        const existingItem = cart.cartItems.find(
            (item) => item.product.id === productId && item.size === size
        );
        if (existingItem && (existingItem.quantity + quantity > 5)) {
            toast.error("You already have the maximum units allowed for this item in your cart.");
            return;
        }
        dispatch(addToCart(productId, size, quantity));
    };

    if (loading) {
        return <Loader />
    };

    if (error) {
        return <ErrorPage code={400} title='An Error Occurred!' description={error} />
    };

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Left column */}
            <ImageCarousel product={product} />

            {/* Right column */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    {product.brand} {product.title}
                </h1>

                <div className="pt-4 inline-flex cursor-pointer" onClick={scrollToReviews}>
                    <StarRating rating={product.averageRating} />
                    <p className="ml-2 text-sm text-gray-500">
                        {product.totalReviews} review{product.totalReviews > 1 && "s"}
                    </p>
                </div>

                <div className="mt-6">
                    <div className="flex items-center gap-2">
                        <p className="text-2xl text-gray-900 font-semibold">
                            {currency} {product.discountedPrice}
                        </p>
                        <p className="text-lg text-gray-500 line-through">
                            {currency} {product.price}
                        </p>
                        <p className="text-lg text-green-500">
                            ({product.discountPercent}% OFF)
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="sr-only">Description</h3>
                    <div className="text-base text-gray-700 space-y-6">{product.description}</div>
                </div>

                <div className="mt-6">
                    <h3 className="font-medium text-gray-900">Size</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {product?.sizes?.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSize(item.name)}
                                disabled={item.quantity === 0}
                                className={`border-2 rounded-md py-2 px-4 text-sm font-medium transition-all
                                    ${item.quantity === 0
                                        ? 'opacity-40'
                                        : item.name === size
                                            ? 'bg-black border-black text-white hover:bg-gray-800'
                                            : isRecommendedSize(item.name)
                                                ? 'border-green-500 border-2 hover:bg-gray-100'
                                                : 'border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

                {isAuthenticated && getRecommendedSize() && (
                    <div className="flex items-center gap-2 mt-4 text-success-600">
                        <PencilRuler className="h-4 w-4" />
                        <span>
                            We recommend size <span className="font-semibold">
                                {getRecommendedSize()}
                            </span> for <span className="font-semibold">
                                {profile.firstName} {profile.lastName}
                            </span>
                        </span>
                    </div>
                )}

                <div className="mt-10 flex sm:flex-col1 space-x-4">
                    <div className="w-24">
                        <label htmlFor="quantity" className="sr-only">
                            Quantity
                        </label>
                        <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={handleQuantityChange}
                            disabled={isOutOfStock}
                            className={`w-full h-full rounded-md border border-gray-300 py-2 px-3 text-base leading-normal text-gray-700 ${isOutOfStock && 'opacity-50'}`}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => handleAddToCart(product.id, size, quantity)}
                        disabled={loading || isOutOfStock || !size}
                        className={`flex-1 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white transition-all transform 
                            ${isOutOfStock
                                ? 'bg-[#cdcdcd] cursor-default'
                                : size
                                    ? 'bg-black hover:bg-gray-800'
                                    : 'bg-[#cdcdcd] cursor-default'
                            }`}
                    >
                        {loading ? (
                            <Loader2Icon className="animate-spin" />
                        ) : isOutOfStock ?
                            'Out of Stock'
                            : 'Add to Cart'
                        }
                    </button>
                </div>

                <div className="mt-6 text-center">
                    {isOutOfStock ? (
                        <p className="mt-1 text-sm text-red-500 font-semibold">
                            This product is currently out of stock
                        </p>
                    ) : (
                        <p className="mt-1 text-sm text-gray-500">
                            {product.quantity} item{product.quantity > 1 && "s"} available.
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProductSection;