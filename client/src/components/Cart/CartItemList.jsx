import React from 'react';
import { PlusIcon, MinusIcon } from 'lucide-react';
import SizeDropdown from '../../components/Cart/SizeDropdown';

const CartItemList = ({ cartItems, currency = 'INR', onQuantityChange, onSizeChange, onRemoveItem, onMoveToWishlist }) => {
    return (
        <>
            {cartItems && cartItems.map((item, index) => (
                <div key={index} className="border-b border-primary-lighter p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Product Info */}
                        <div className="col-span-1 md:col-span-4 flex items-center">
                            <div className="w-20 md:w-24 flex-shrink-0 rounded-md overflow-hidden">
                                <img
                                    src={item.product.preview}
                                    alt={item.product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="ml-4">
                                <h3 className="font-medium text-primary-dark">{item.product.title}</h3>
                                <p className="text-sm text-primary-light">{item.product.brand}</p>
                                <p className="text-sm text-primary-light">{item.product.color}</p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                            <span className="text-sm font-medium md:hidden">Price:</span>
                            <div className="text-right md:text-center flex items-center gap-2 md:block">
                                <p className="font-medium">{currency} {item.product.discountedPrice}</p>
                                <p className="text-sm text-primary-light line-through">{currency} {item.product.price}</p>
                            </div>
                        </div>

                        {/* Size */}
                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                            <span className="text-sm font-medium md:hidden">Size:</span>
                            <div className="w-20 xl:w-24">
                                {item.product.sizes && item.product.sizes.length > 0 ? (
                                    <SizeDropdown
                                        sizes={item.product.sizes}
                                        currentSize={item.size}
                                        onSizeChange={(newSize) => onSizeChange(item.id, newSize, item.size)}
                                    />
                                ) : (
                                    <div className="px-3 py-2 text-sm border border-primary-light-2x rounded-md text-center">
                                        {item.size}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                            <span className="text-sm font-medium md:hidden">Quantity:</span>
                            <div className="w-20 xl:w-24 flex items-center justify-around border border-primary-light-2x rounded-md py-0.5">
                                <button
                                    onClick={() => onQuantityChange(item.id, item.quantity - 1, item.quantity)}
                                    className="p-2 text-primary-light hover:text-primary-dark disabled:opacity-50"
                                >
                                    <MinusIcon size={16} />
                                </button>
                                <span className="text-center">{item.quantity}</span>
                                <button
                                    onClick={() => onQuantityChange(item.id, item.quantity + 1, item.quantity)}
                                    className="p-2 text-primary-light hover:text-primary-dark disabled:opacity-50"
                                >
                                    <PlusIcon size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                            <span className="text-sm font-medium md:hidden">Total:</span>
                            <div className="text-right flex items-center gap-2 md:block">
                                <p className="font-medium">{currency} {item.discountedPrice}</p>
                                <p className="text-sm text-primary-light line-through">{currency} {item.price}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4 md:mt-2">
                        <button
                            onClick={() => onRemoveItem(item.id)}
                            className="border border-primary-light-2x rounded px-4 py-2 text-sm font-medium text-primary hover:bg-primary-lighter transition-all duration-300"
                        >
                            Remove
                        </button>
                        <button
                            onClick={() => onMoveToWishlist(item.id, item.product.id)}
                            className="border border-primary-light-2x rounded px-4 py-2 text-sm font-medium text-primary hover:bg-primary-lighter transition-all duration-300"
                        >
                            Move to Wishlist
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
};

export default CartItemList;