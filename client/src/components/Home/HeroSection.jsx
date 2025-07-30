import { motion } from 'framer-motion';

const HeroSection = () => {
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

export default HeroSection;