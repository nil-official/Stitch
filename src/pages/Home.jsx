import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Zap, Award, TrendingUp } from 'lucide-react'
import axios from 'axios'
import BASE_URL from '../utils/baseurl'

const API_ENDPOINTS = [
  { title: 'Exclusive Discounts', url: `${BASE_URL}/public/exclusive-discounts`, style: 'discount' },
  { title: 'New Arrivals', url: `${BASE_URL}/public/new-arrivals`, style: 'new' },
  { title: 'Featured Products', url: `${BASE_URL}/public/featured-products`, style: 'featured' },
  { title: 'Top Rated', url: `${BASE_URL}/public/top-rated`, style: 'rated' },
  { title: 'Best Sellers', url: `${BASE_URL}/public/best-seller`, style: 'seller' }
]

export default function Home() {
  const [productSections, setProductSections] = useState([])

  useEffect(() => {
    const fetchProductData = async (endpoint) => {
      try {
        const response = await axios.get(endpoint.url)
        return { ...endpoint, products: response.data }
      } catch (error) {
        console.error(`Error fetching ${endpoint.title}:`, error)
        return { ...endpoint, products: [] }
      }
    }

    const fetchAllProductData = async () => {
      const results = await Promise.all(API_ENDPOINTS.map(fetchProductData))
      const nonEmptySections = results.filter(section => section.products.length > 0)
      setProductSections(nonEmptySections)
    }

    fetchAllProductData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Hero />
      {productSections.map((section, index) => (
        <ProductSection key={index} title={section.title} products={section.products} style={section.style} />
      ))}
    </div>
  )
}

function Hero() {
  return (
    <section className="py-32 px-6 overflow-hidden">
      <div className="container mx-auto text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold mb-6 text-gray-800"
        >
          Discover Your Style
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl mb-12 text-gray-600"
        >
          Explore the latest trends and exclusive discounts
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800 text-white px-8 py-2 rounded-full font-semibold text-lg hover:bg-gray-700 transition duration-300"
        >
          Shop Now
        </motion.button>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute -top-16 left-0 w-48 h-48 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute -bottom-8 right-0 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
        />
      </div>
    </section>
  )
}

function ProductSection({ title, products, style }) {
  return (
    <section className="pt-10 pb-20 px-6">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
        >
          {title}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {products.slice(0, 10).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} style={style} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, index, style }) {
  // const cardStyles = {
  //   discount: "bg-red-50 border-red-200",
  //   new: "bg-green-50 border-green-200",
  //   featured: "bg-blue-50 border-blue-200",
  //   rated: "bg-yellow-50 border-yellow-200",
  //   seller: "bg-purple-50 border-purple-200"
  // }

  const iconStyles = {
    discount: <Zap className="w-5 h-5 text-red-500" />,
    new: <ShoppingCart className="w-5 h-5 text-green-500" />,
    featured: <Star className="w-5 h-5 text-blue-500" />,
    rated: <Award className="w-5 h-5 text-yellow-500" />,
    seller: <TrendingUp className="w-5 h-5 text-purple-500" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border flex flex-col w-64`}
    >
      <div className="relative w-full overflow-hidden bg-gray-200">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-[350px] object-cover object-top hover:scale-110 transition ease-in-out"
          />
        </Link>
        <div className={`absolute top-2 right-2 p-1 rounded-full`}>
          {iconStyles[style]}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold mb-1 text-gray-800 line-clamp-2">{product.title}</h3>
        <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
        {/* <div className="flex items-center mb-2">
          <p className="bg-green-500 text-white text-sm font-bold px-2 py-1 flex items-center justify-center rounded-lg">
            {product.averageRating} ★
          </p>
        </div> */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 line-through">
              INR&nbsp;{product.price.toFixed(2)}
            </span>
            <span className="text-gray-700">
              INR&nbsp;{product.discountedPrice.toFixed(2)}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white p-2 rounded-full"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>

      </div>
    </motion.div>
  )
}
