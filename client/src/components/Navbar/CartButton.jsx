import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingCart } from 'lucide-react';
import { CHECKOUT_ROUTES } from '../../routes/routePaths';
import { getCart } from '../../redux/customer/cart/action';

const CartButton = () => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getCart());
        }
    }, [isAuthenticated, dispatch]);

    return (
        <Link to={CHECKOUT_ROUTES.CART}>
            <div className="flex items-center justify-center md:min-w-28 space-x-2 px-3 py-2 rounded-md hover:bg-primary-800 transition-colors cursor-pointer">
                <div className='flex gap-2'>
                    <Search className='hidden' />
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        {isAuthenticated && cart && cart.totalItem > 0 && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-bold">
                                {cart.totalItem}
                            </span>
                        )}
                    </div>
                </div>
                <span className="hidden md:inline text-sm font-medium">Cart</span>
            </div>
        </Link>
    )
}

export default CartButton;