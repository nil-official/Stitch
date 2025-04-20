import React from 'react';
import { Pencil, CheckCircle, TrashIcon } from 'lucide-react';

const AddressList = ({ addresses, selectedAddressId, onAddressSelect, onEditAddress, onDeleteAddress }) => {
    return (
        <div className="space-y-4">
            {addresses.map((addr) => (
                <div
                    key={addr.id}
                    className={`bg-white border rounded-lg p-4 cursor-pointer ${selectedAddressId === addr.id ? 'border-gray-700' : 'border-gray-200'
                        }`}
                    onClick={() => onAddressSelect(addr.id)}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex items-start gap-3 w-full">
                            <div className="mt-1">
                                {selectedAddressId === addr.id ? (
                                    <CheckCircle size={20} className="text-gray-700" />
                                ) : (
                                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex flex-wrap gap-2">
                                    {addr.isDefault && (
                                        <span className="bg-gray-100 text-sm px-2 py-1 rounded-md">
                                            Default
                                        </span>
                                    )}
                                    <span className="bg-gray-100 text-sm px-2 py-1 rounded-md">
                                        {addr.type.charAt(0).toUpperCase() + addr.type.slice(1).toLowerCase()}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:gap-3">
                                    <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                                    <p className="text-gray-600">{addr.mobile}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600">{addr.streetAddress}</p>
                                    <p className="text-gray-600">{addr.city}, {addr.state}, {addr.zipCode}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:justify-end">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditAddress(addr);
                                }}
                                className="md:hidden border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteAddress(addr.id);
                                }}
                                className="md:hidden border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                            >
                                Remove
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditAddress(addr);
                                }}
                                className="hidden md:block text-gray-600 hover:text-gray-800"
                                aria-label="Edit address"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteAddress(addr.id);
                                }}
                                className="hidden md:block text-gray-600 hover:text-gray-800"
                                aria-label="Delete address"
                            >
                                <TrashIcon size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AddressList;