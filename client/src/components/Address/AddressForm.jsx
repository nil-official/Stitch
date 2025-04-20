import React from 'react';

const AddressForm = ({ address, onSubmit, onCancel, onChange, isEditing = false }) => {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        onChange({
            ...address,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    return (
        <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-md font-medium mb-3">
                {isEditing ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form onSubmit={onSubmit} className='flex flex-col gap-8 md:gap-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={address.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={address.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={address.mobile}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={address.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                            type="text"
                            name="streetAddress"
                            value={address.streetAddress}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={address.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                            type="text"
                            name="state"
                            value={address.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-8 mt-1 px-4 py-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="home-type"
                                    name="type"
                                    value="HOME"
                                    checked={address.type === 'HOME'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-gray-700"
                                />
                                <label htmlFor="home-type" className="block text-gray-700">
                                    Home (All day delivery)
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="office-type"
                                    name="type"
                                    value="OFFICE"
                                    checked={address.type === 'OFFICE'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-gray-700"
                                />
                                <label htmlFor="office-type" className="block text-gray-700">
                                    Office (10 AM - 5 PM delivery)
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='md:col-span-2'>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="default-address"
                                name="isDefault"
                                checked={address.isDefault}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-gray-700"
                            />
                            <label htmlFor="default-address" className="block font-medium text-gray-700">
                                Set as default address
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-all duration-300"
                    >
                        {isEditing ? 'Update Address' : 'Save Address'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-all duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;