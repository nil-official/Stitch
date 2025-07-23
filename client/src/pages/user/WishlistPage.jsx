import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../../components/Wishlist/ProductCard';
import { getWishlist } from '../../redux/customer/wishlist/action';
import EmptyPage from '../EmptyPage';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { EMPTY_WISHLIST } from '../../assets/asset';
import { AUTH_ROUTES } from '../../routes/routePaths';

const WishlistPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (!isAuthenticated)
      navigate(AUTH_ROUTES.LOGIN);
    else
      dispatch(getWishlist());
  }, [isAuthenticated, dispatch]);

  if (!wishlist || wishlist.length === 0) {
    return <EmptyPage
      heading={"My Wishlist"}
      image={EMPTY_WISHLIST}
      title={"Your Wishlist is Empty!"}
      description={"Looks like you haven’t added anything to your wishlist yet. Explore our collection and add your favorite items!"}
      button={"Add Now"}
      forwardNav={"/products"}
    />;
  };

  return (
    <div className='min-h-[60vh] flex flex-col items-center gap-8 py-8 lg:py-12'>
      <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
        <div className='flex items-center gap-4 mb-6'>
          <Link to='/' className="text-primary-700 hover:text-primary-800 transition-all duration-300">
            <ChevronLeft size={32} />
          </Link>
          <p className="text-2xl font-semibold">My Wishlist ({wishlist.length} items)</p>
        </div>

        {wishlist.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {wishlist.map((item, index) => (
              <ProductCard key={index} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;