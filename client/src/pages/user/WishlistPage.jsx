import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../../components/Wishlist/ProductCard';
import { getWishlist } from '../../redux/customer/wishlist/action';
import EmptyPage from '../EmptyPage';

const WishlistPage = () => {

  const dispatch = useDispatch();
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  return (
    <div className='min-h-[60vh] flex justify-center'>
      <div className="w-[1400px] py-12">
        <h2 className="text-2xl font-bold mb-4">
          My Wishlist <span className="text-gray-500">({wishlist.length} items)</span>
        </h2>
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {wishlist.map((item, index) => (
              <ProductCard key={index} product={item.product} />
            ))}
          </div>
        ) : (
          <EmptyPage
            image={"/empty-wishlist.png"}
            title={"Your Wishlist is Empty!"}
            description={"Looks like you haven’t added anything to your wishlist yet. Explore our collection and add your favorite items!"}
            button={"Add Now"}
            navigation={"/"}
          />
        )}
      </div>
    </div>
  );
};

export default WishlistPage;