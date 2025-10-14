import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ImageCarousel from './Carousel/ImageCarousel'
import ProductDetails from './ProductDetails';
import WishlistButton from './Buttons/WishlistButton';
import ErrorPage from '../../pages/ErrorPage';
import { getProduct } from '../../redux/customer/product/action';
import { getProfile } from '../../redux/customer/profile/action';
import ShareButton from './Buttons/ShareButton';
import Loader from '../Loader';

const ProductSection = ({ productId, scrollToReviews }) => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const { cart, loading: cartLoading } = useSelector((state) => state.cart);
    const { address, loading: addressLoading } = useSelector((state) => state.address);
    const { product, loading: productLoading, error } = useSelector((state) => state.product);

    useEffect(() => {
        if (productId) dispatch(getProduct(productId));
    }, [dispatch, productId]);

    useEffect(() => {
        if (isAuthenticated && !profile) dispatch(getProfile());
    }, [isAuthenticated, profile, dispatch]);

    if (error) {
        return <ErrorPage
            code={400}
            title='An Error Occurred!'
            description={error}
        />
    };

    if (productLoading || addressLoading) {
        return <Loader className='h-[80vh]' />
    };

    return (
        product.id && (
            <div className='relative md:p-4 grid grid-cols-1 md:grid-cols-[1.5fr_3fr_auto] gap-x-6 lg:gap-x-10 items-start'>
                <ImageCarousel
                    product={product}
                    scrollToReviews={scrollToReviews}
                />

                <ProductDetails
                    cart={cart}
                    cartLoading={cartLoading}
                    product={product}
                    profile={profile}
                    address={address}
                    isAuthenticated={isAuthenticated}
                    scrollToReviews={scrollToReviews}
                />

                <div className='absolute top-4 right-4 md:static flex flex-col items-center gap-4 z-20'>
                    <WishlistButton
                        product={product}
                        isAuthenticated={isAuthenticated}
                    />
                    <ShareButton
                        product={product}
                    />
                </div>
            </div>
        ));
};

export default ProductSection;