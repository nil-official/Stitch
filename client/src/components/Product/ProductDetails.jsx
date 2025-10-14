import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ChevronDown, Loader2Icon, PencilRuler, MapPin, Truck, Banknote, RefreshCw } from 'lucide-react';
import StarRating from './Reviews/StarRating';
import { addToCart } from '../../redux/customer/cart/action';
import AddressPopup from './Address/AddressPopup';

const ProductDetails = ({ cart, cartLoading, product, profile, address, isAuthenticated, scrollToReviews }) => {

    const dispatch = useDispatch();
    const [size, setSize] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [quantity, setQuantity] = useState(1);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const isOutOfStock = product.quantity === 0 || false;

    useEffect(() => {
        if (address && address.length > 0) {
            const defaultAddr = address.find(addr => addr.isDefault);
            setSelectedAddress(defaultAddr || address[0]);
        }
    }, [address]);

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

    const getDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.streetAddress}, ${addr.city}, ${addr.state} - ${addr.zipCode}`;
    };

    return (
        <div className="p-4 md:p-0">
            <div className='text-gray-900'>
                <p className="text-base md:text-xl lg:text-2xl font-bold md:font-extrabold">{product.brand}</p>
                <p className='text-sm md:text-lg lg:text-xl'>{product.title}</p>
            </div>

            {product.totalReviews > 0 &&
                <div className="hidden mt-2 lg:mt-4 md:inline-flex cursor-pointer items-center" onClick={scrollToReviews}>
                    <StarRating rating={product.averageRating} />
                    <p className="ml-2 text-xs lg:text-sm text-gray-500">
                        {product.totalReviews} review{product.totalReviews > 1 && "s"}
                    </p>
                </div>
            }

            <div className="mt-4">
                <div className="flex items-center gap-2">
                    <p className="text-base md:text-xl lg:text-2xl font-semibold text-gray-900">
                        {currency} {product.discountedPrice}
                    </p>
                    <p className="text-sm md:text-lg lg:text-xl text-gray-500 line-through">
                        {currency} {product.price}
                    </p>
                    <p className="text-sm md:text-base lg:text-lg text-green-500">
                        ({product.discountPercent}% OFF)
                    </p>
                </div>
            </div>

            <div className="mt-2 md:mt-4">
                <div className="text-xs md:text-base text-gray-700 space-y-6">{product.description}</div>
            </div>

            <div className="mt-4">
                <h3 className="text-base md:text-xl font-semibold text-gray-900">Size</h3>
                <div className="mt-2 md:mt-4 flex flex-wrap gap-2">
                    {product?.sizes?.map((item, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSize(item.name)}
                            disabled={item.quantity === 0}
                            className={`border rounded-md py-2 px-4 text-sm font-medium transition-all
                                    ${item.quantity === 0
                                    ? 'opacity-20 border-primary-300'
                                    : item.name === size
                                        ? 'border-primary-900 bg-primary-900 text-white hover:bg-gray-800'
                                        : isRecommendedSize(item.name)
                                            ? 'border-green-500 hover:bg-gray-100'
                                            : 'border-primary-900 hover:bg-gray-100'
                                }`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {!isOutOfStock && isAuthenticated && getRecommendedSize() && (
                <div className="flex items-center gap-2 mt-4 text-success-600">
                    <PencilRuler className="h-4 w-4" />
                    <span className='text-sm md:text-base'>
                        We recommend size <span className="font-semibold">
                            {getRecommendedSize()}
                        </span> for <span className="font-semibold">
                            {profile.firstName} {profile.lastName}
                        </span>
                    </span>
                </div>
            )}

            {!isOutOfStock &&
                <div className="mt-4 md:mt-6 flex space-x-4">
                    <button
                        type="button"
                        onClick={() => handleAddToCart(product.id, size, quantity)}
                        disabled={cartLoading || isOutOfStock || !size}
                        className={`flex-1 border rounded-md py-2 px-4 md:py-3 md:px-8 flex items-center justify-center text-sm md:text-base font-medium transition-all transform ${cartLoading || isOutOfStock || !size ? 'text-[#cdcdcd] border-[#cdcdcd] cursor-default' : 'text-primary-900 bg-white border-primary-900 hover:bg-primary-100'}`}
                    >
                        Buy Now
                    </button>

                    <button
                        type="button"
                        onClick={() => handleAddToCart(product.id, size, quantity)}
                        disabled={cartLoading || isOutOfStock || !size}
                        className={`flex-1 border border-transparent rounded-md py-2 px-4 md:py-3 md:px-8 flex items-center justify-center text-sm md:text-base font-medium text-white transition-all transform ${cartLoading || isOutOfStock || !size ? 'bg-[#cdcdcd] cursor-default' : 'bg-primary-900 hover:bg-primary-800'}`}
                    >
                        {cartLoading ? <Loader2Icon className="animate-spin" /> : 'Add to Cart'}
                    </button>
                </div>
            }

            {isOutOfStock &&
                <div className="mt-4 text-center">
                    <p className="mt-1 text-sm text-red-500 font-semibold">
                        This product is currently out of stock
                    </p>

                </div>
            }

            <div className='mt-4'>
                <h3 className="text-base md:text-xl font-semibold text-gray-900">Delivery Options</h3>

                {/* Address Selection Box */}
                {selectedAddress && (
                    <div className='mt-4'>
                        <div
                            className='px-4 md:px-6 py-3 flex items-center justify-between gap-3 text-sm md:text-base rounded-lg border border-primary-300 cursor-pointer'
                            onClick={() => setShowAddressModal(true)}
                        >
                            <div className='flex items-center gap-4 flex-1 min-w-0'>
                                <MapPin className='w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0' />
                                <div className='flex-1 min-w-0'>
                                    <p className='font-semibold text-gray-900'>
                                        {selectedAddress.firstName} {selectedAddress.lastName}
                                    </p>
                                    <p className='text-gray-600 truncate text-xs md:text-sm'>
                                        {formatAddress(selectedAddress)}
                                    </p>
                                </div>
                            </div>
                            <ChevronDown className='w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0' />
                        </div>
                    </div>
                )}

                {/* Delivery Information */}
                <div className='space-y-3 text-sm md:text-base mt-4'>
                    <div className='flex items-start gap-3'>
                        <Truck className='w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='font-medium text-gray-900'>Get it by {getDeliveryDate()}</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-3'>
                        <Banknote className='w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='text-gray-900'>Pay on delivery available</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-3'>
                        <RefreshCw className='w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='text-gray-900'>
                                Easy 14 days return & exchange available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <AddressPopup
                showAddressModal={showAddressModal}
                address={address}
                selectedAddress={selectedAddress}
                onSetShowAddressModal={setShowAddressModal}
                onSetSelectedAddress={setSelectedAddress}
            />
        </div>
    )
};

export default ProductDetails;