import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import WishListProductCard from '../components/wishListProductCard';
import BASE_URL from '../utils/baseurl';

const Wishlist = () => {
  const [wishListItems, setWishListItems] = useState([]); // Corrected state variable name
  const [render, setRender] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/wishlist/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        console.log(res);
        setWishListItems(res.data.wishlistItems || []);
        console.log("wishlist fetched:", res.data.wishlistItems);
      } catch (err) {
        console.error("Something went wrong", err);
        setWishListItems([]);
      }
    };

    fetchProducts();
  }, [render]);

  return (
    <div className='flex justify-center min-h-[60vh]'>
      <div className="w-[1400px] p-6">
        <h2 className="text-2xl font-bold mb-4">
          My Wishlist <span className="text-gray-500">({wishListItems.length} items)</span>
        </h2>
        {wishListItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {wishListItems
              .sort((a, b) => new Date(b.id) - new Date(a.id))
              .map((item, index) => (
                <WishListProductCard
                  key={index}
                  id={item.id}
                  productId={item.product.id}
                  image={item.product.imageUrl}
                  name={item.product.title}
                  size={item.size}
                  price={item.product.price}
                  discountedPrice={item.product.discountedPrice}
                  discountPercent={item.product.discountPercent}
                  render={render}
                  setRender={setRender}
                />
              ))}
          </div>
        ) : (
          <p>No items in the wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
