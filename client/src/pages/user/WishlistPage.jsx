import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../../components/Wishlist/ProductCard';
import { getWishlist } from '../../redux/customer/wishlist/action';
import EmptyPage from '../EmptyPage';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const WishlistPage = () => {

  const dispatch = useDispatch();
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  if (!wishlist || wishlist.length === 0) {
    return <EmptyPage
      heading={"My Wishlist"}
      image={"/empty-wishlist.jpg"}
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
          <Link to='/' className="text-primary hover:text-primary-dark transition-all duration-300">
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