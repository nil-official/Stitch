import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import Confirmation from '../Confirmation';
import { getAddress, addAddress, updateAddress, deleteAddress } from '../../redux/customer/address/action';

const AddressManagement = () => {

    const dispatch = useDispatch();
    const { address, loading, error } = useSelector((state) => state.address);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mobile: ''
    });

    useEffect(() => {
        dispatch(getAddress());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddClick = () => {
        setEditingAddress(null);
        setFormData({
            firstName: '',
            lastName: '',
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            mobile: ''
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (address) => {
        setEditingAddress(address);
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            streetAddress: address.streetAddress,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            mobile: address.mobile
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            dispatch(updateAddress(editingAddress.id, formData));
        } else {
            dispatch(addAddress(formData));
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = (address) => {
        setAddressToDelete(address);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (addressToDelete) {
            dispatch(deleteAddress(addressToDelete.id));
            setShowDeleteConfirm(false);
            setAddressToDelete(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-medium">Manage Addresses</h2>
                <button
                    onClick={handleAddClick}
                    className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded transition"
                >
                    <Plus size={18} className="mr-2" />
                    Add New Address
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : address && address.length > 0 ? (
                <div className="space-y-4">
                    {address.map((address) => (
                        <div key={address.id} className="border border-gray-300 rounded p-4 transition w-full">
                            <span className='bg-gray-100 text-sm px-2 py-1 rounded-md'>Home</span>
                            <div className="flex justify-between items-start my-2">
                                <div className='flex gap-4'>
                                    <h3 className="font-medium">{address.firstName} {address.lastName}</h3>
                                    <p className="font-medium">{address.mobile}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditClick(address)}
                                    >
                                        <Pencil
                                            size={18}
                                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                                        />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(address)}
                                    >
                                        <Trash2
                                            size={18}
                                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                                        />
                                    </button>
                                </div>
                            </div>
                            <p className="mb-1">
                                {address.streetAddress}, {address.city}, {address.state}, {address.zipCode}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-6 text-center text-gray-500">
                    <p>You don't have any saved addresses yet.</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="flex flex-col gap-4 bg-white rounded-md w-full max-w-md p-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X
                                    size={18}
                                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                                />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            <div className='flex flex-col gap-2'>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        id="streetAddress"
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                            Pin Code
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            id="zipCode"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={(e) => {
                                                if (/^\d*$/.test(e.target.value)) {
                                                    handleInputChange(e);
                                                }
                                            }}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            id="mobile"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={(e) => {
                                                if (/^\d*$/.test(e.target.value)) {
                                                    handleInputChange(e);
                                                }
                                            }}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    {editingAddress ? 'Update Address' : 'Add Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Confirmation
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setAddressToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Address"
                message="Are you sure you want to delete this address? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default AddressManagement;