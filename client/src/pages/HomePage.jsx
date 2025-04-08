import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetJustLoggedIn } from '../redux/auth/action'
import { getHomeProducts } from '../redux/customer/home/action'
import UserInfoDialog from '../components/Home/UserInfoDialog'
import HeroSection from '../components/Home/HeroSection'
import ProductSection from '../components/Home/ProductSection'

const HomePage = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {

  const dispatch = useDispatch();
  const { justLoggedIn } = useSelector((state) => state.auth);
  const { products, loading, error } = useSelector((state) => state.home);
  const [showPopup, setShowPopup] = useState(false);

  const sectionConfig = [
    { key: 'discountedProducts', title: 'Exclusive Discounts', style: 'discount' },
    { key: 'newArrivals', title: 'New Arrivals', style: 'new' },
    { key: 'featuredProducts', title: 'Featured Products', style: 'featured' },
    { key: 'topRatedProducts', title: 'Top Rated', style: 'rated' },
    { key: 'bestSellerProducts', title: 'Best Sellers', style: 'seller' },
  ];

  useEffect(() => {
    if (justLoggedIn) {
      setShowPopup(true);
      dispatch(resetJustLoggedIn());
    }
  }, [justLoggedIn, dispatch]);

  useEffect(() => {
    dispatch(getHomeProducts(1, 10));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {showPopup &&
        <UserInfoDialog
          onClose={() => setShowPopup(false)}
        />
      }

      <HeroSection
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchInputRef={searchInputRef}
      />

      {!loading && !error && sectionConfig.map(({ key, title, style }) => {
        const sectionData = products[key];
        const sectionProducts = sectionData?.content || [];
        if (sectionProducts.length === 0) return null;

        return (
          <ProductSection
            key={key}
            title={title}
            products={sectionProducts}
            style={style}
          />
        );
      })}
    </div>
  )
};

export default HomePage;