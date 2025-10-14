import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Loader2Icon } from 'lucide-react';
import { addToWishlist, getWishlist, removeFromWishlist } from '../../../redux/customer/wishlist/action';
import toast from 'react-hot-toast';

const WishlistButton = ({ product, isAuthenticated }) => {

    const dispatch = useDispatch();
    const [isWishlist, setIsWishlist] = useState(false);
    const { wishlist, loading, error } = useSelector((state) => state.wishlist);

    useEffect(() => {
        if (isAuthenticated) dispatch(getWishlist());
    }, [isAuthenticated, product]);

    useEffect(() => {
        setIsWishlist(wishlist.some(item => item.product?.id === product.id));
    }, [wishlist, product.id]);

    const toggleWishlist = () => {
        if (!isAuthenticated) {
            toast.error('Please login first.');
            return;
        }
        isWishlist ? dispatch(removeFromWishlist(product.id)) : dispatch(addToWishlist(product.id));
    };

    return (
        <button
            onClick={toggleWishlist}
            className="p-3 bg-white text-primary-800 shadow-md rounded-full"
        >
            {loading ?
                <Loader2Icon
                    size={20}
                    className="animate-spin"
                /> :
                <Heart
                    size={20}
                    className={isWishlist && `text-red-500`}
                    fill={isWishlist ? 'currentColor' : 'none'}
                />
            }
        </button>
    )
}

export default WishlistButton;