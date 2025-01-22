import React from 'react';

const ProductRow = ({ product, onEdit, onDelete }) => {
	return (
		<div className="flex flex-col sm:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden">
			{/* Product Image */}
			<div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-gray-100 flex items-center justify-center">
				<img
					src={product.imageUrl || '/placeholder.png'}
					alt={product.title}
					className="object-contain h-20"
				/>
			</div>

			{/* Product Info */}
			<div className="flex flex-col flex-grow px-6 py-4 space-y-2">
				<h2 className="text-lg font-semibold text-gray-900">{product.title}</h2>
				<p className="text-sm text-gray-500">{product.brand}</p>
				<div className="text-lg font-medium text-gray-900 flex items-center space-x-2">
					<span className="line-through text-gray-500">₹{product.price}</span>
					<span className="text-red-600">₹{product.discountedPrice}</span>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end space-x-4 p-4">
				<button
					onClick={onEdit}
					className="px-4 py-2 bg-gray-50 text-sm font-semibold shadow rounded-lg text-black-600 hover:text-black-800 hover:shadow-lg hover:bg-gray-100 transition"
				>
					Edit
				</button>
				<button
					onClick={onDelete}
					className="px-4 py-2 text-sm font-semibold shadow rounded-lg text-red-600 hover:shadow-lg hover:bg-red-600 hover:text-white transition"
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default ProductRow;
