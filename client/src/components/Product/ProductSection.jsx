import React, { useState } from 'react'
import ImageCarousel from './ImageCarousel'
import StarRating from './StarRating';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/customer/cart/cartActions';

const ProductSection = ({ product, scrollToReviews }) => {

    const dispatch = useDispatch();
    const [currency, setCurrency] = useState('INR');
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const isOutOfStock = product.quantity === 0;

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value !== '' && value !== 0) {
            setQuantity(parseInt(value));
        }
    };

    const handleAddToCart = (productId, size, quantity) => {
        dispatch(addToCart(productId, size, quantity));
    };

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Left column */}
            <ImageCarousel product={product} />

            {/* Right column */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    {product.title}
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
                        {product.sizes.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSize(item.name)}
                                disabled={item.quantity === 0}
                                className={`border rounded-md py-2 px-4 text-sm font-medium transition-all
                                    ${item.quantity === 0
                                        ? 'opacity-40'
                                        : item.name === size
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'border-gray-200 hover:bg-gray-100'}`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

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
                        disabled={isOutOfStock || !size}
                        className={`flex-1 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white transition-all transform 
                            ${isOutOfStock
                                ? 'bg-[#cdcdcd] cursor-default'
                                : size
                                    ? 'bg-black hover:bg-gray-800'
                                    : 'bg-[#cdcdcd] cursor-default'
                            }`}
                    >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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
    )
}

export default ProductSection;