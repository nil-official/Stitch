import { Link } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { MinusIcon, PlusIcon } from 'lucide-react';
import SizeDropdown from '../../components/Cart/SizeDropdown';

const CartItemList = ({
    cartItems,
    currency = 'INR',
    onQuantityChange,
    onSizeChange,
    onRemoveItem,
    onMoveToWishlist,
    selectedItems = [],
    onSelectItem,
    onSelectAll
}) => {

    const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

    return (
        <div className="border border-primary-200 rounded-lg shadow-sm">

            {/* Heading with selector */}
            <div className="p-2 md:p-4 border-b border-primary-200">
                <div className="flex items-center gap-2 md:gap-4">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => onSelectAll(!allSelected)}
                    />
                    <span className="text-sm md:text-base font-medium">
                        {selectedItems.length}/{cartItems.length} ITEMS SELECTED
                    </span>
                </div>
            </div>

            {/* Cart Items */}
            {cartItems && cartItems.map((item, index) => {
                const isSelected = selectedItems.includes(item.id);

                return (
                    <div key={index} className="border-b border-primary-200 last:border-b-0">
                        <div className="px-2 py-3 md:p-4 flex flex-col gap-4">
                            <div className='flex gap-4'>
                                {/* Checkbox */}
                                <div className="flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onSelectItem(item.id)}
                                    />
                                </div>

                                <div className='flex flex-grow gap-4'>
                                    {/* Product Image */}
                                    <div className="flex-shrink-0 h-36 md:h-56 rounded-md overflow-hidden">
                                        <Link to={`/product/${item.product.id}`}>
                                            <img
                                                src={item.product.preview}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover cursor-pointer"
                                            />
                                        </Link>
                                    </div>

                                    {/* Product Details */}
                                    <div className='flex flex-col flex-grow gap-4 md:border-b border-primary-200'>
                                        <div className="flex flex-col md:flex-row gap-2 justify-between">
                                            <div className='flex flex-col gap-0.5 md:gap-1.5'>
                                                <h3 className="md:font-medium text-primary-800">{item.product.title}</h3>
                                                <p className="text-sm text-primary-600">{item.product.brand}</p>
                                                <p className="hidden md:block text-sm text-primary-600">{item.product.color}</p>
                                            </div>
                                            <div className="flex flex-col gap-0.5 md:gap-1.5">
                                                <div className='flex gap-2 items-center md:justify-end'>
                                                    {item.product.discountPercent > 0 && (
                                                        <p className='text-xs font-medium bg-success-50 text-success-600 px-2 py-1 rounded-md'>
                                                            {item.product.discountPercent}% OFF
                                                        </p>
                                                    )}
                                                    <p className="font-medium">
                                                        {currency} {item.product.discountedPrice}
                                                    </p>
                                                </div>
                                                <div className='flex gap-2 md:justify-end text-sm text-primary-600'>
                                                    <p>MRP: </p>
                                                    <p className={` ${item.product.discountPercent > 0 && 'line-through'}`}>
                                                        {currency} {item.product.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex gap-6'>
                                            {/* Size */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                                                <div className="w-20 xl:w-24">
                                                    {item.product.sizes && item.product.sizes.length > 0 ? (
                                                        <SizeDropdown
                                                            sizes={item.product.sizes}
                                                            currentSize={item.size}
                                                            onSizeChange={(newSize) => onSizeChange(item.id, newSize, item.size)}
                                                        />
                                                    ) : (
                                                        <div className="px-3 py-2 text-sm border border-primary-300 rounded-md text-center">
                                                            {item.size}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                                                <div className="w-20 xl:w-24 flex items-center justify-around border border-primary-300 rounded-md py-0.5">
                                                    <button
                                                        onClick={() => onQuantityChange(item.id, item.quantity - 1, item.quantity)}
                                                        className="p-1 md:p-2 text-primary-600 hover:text-primary-800 disabled:opacity-50"
                                                    >
                                                        <MinusIcon size={16} />
                                                    </button>
                                                    <span className="text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onQuantityChange(item.id, item.quantity + 1, item.quantity)}
                                                        className="p-1 md:p-2 text-primary-600 hover:text-primary-800 disabled:opacity-50"
                                                    >
                                                        <PlusIcon size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery */}
                                        <div>
                                            {item.product.quantity > 0 ? (
                                                <p className="text-sm text-success-600">
                                                    Estimated Delivery by{' '}
                                                    <span className='font-medium'>
                                                        {item.estimatedDelivery || format(addDays(new Date(), 7), 'd MMM')}
                                                    </span>
                                                </p>
                                            ) : (
                                                <p className="text-sm text-error-600">Sold Out</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:gap-4 justify-center md:justify-end pt-2 border-t border-primary-200 md:pt-0 md:border-t-0">
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="md:border border-primary-300 border-r md:rounded px-6 py-1 md:px-4 md:py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 transition-all duration-300"
                                >
                                    REMOVE
                                </button>
                                <button
                                    onClick={() => onMoveToWishlist(item.id, item.product.id)}
                                    className="md:border border-primary-300 rounded px-6 py-1 md:px-4 md:py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 transition-all duration-300"
                                >
                                    MOVE TO WISHLIST
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CartItemList;