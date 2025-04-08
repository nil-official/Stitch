import React from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

const ProductSection = ({ title, products, style }) => {
    return (
        <section className="flex justify-center py-8">
            <div className="w-11/12 sm:w-3/4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="py-6 text-3xl md:text-4xl font-bold text-center text-gray-800"
                >
                    {title}
                </motion.h2>
                <div className="py-6 flex overflow-x-auto overflow-y-hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {products.slice(0, 10).map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} style={style} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductSection;