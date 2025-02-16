import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BASE_URL from '../utils/baseurl';
import { toast } from 'react-toastify';

const Address = () => {

    // State variables
    const [addressData, setAddressData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editAddress, setEditAddress] = useState(null);
    const [errors, setErrors] = useState({});
    const [newAddress, setNewAddress] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
    });

    // Fetch addresses on component mount
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/addresses/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
                });
                setAddressData(res.data);
            } catch (err) {
                console.error('Error fetching addresses:', err);
            }
        };
        fetchAddresses();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    // Add new address
    const addAddress = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/addresses/add`, newAddress, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            setAddressData([...addressData, res.data]); // Add new address to the list
            toast.success('Address added successfully!');
            setNewAddress({
                firstName: '',
                lastName: '',
                mobile: '',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
            });
        } catch (err) {
            console.error('Error adding address:', err);
            toast.error('Failed to add address.');
        }
    };

    // Edit address
    const updateAddress = async () => {
        try {
            const res = await axios.put(`${BASE_URL}/api/addresses/update/${editAddress.id}`, editAddress, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            const updatedAddresses = addressData.map((address) =>
                address.id === editAddress.id ? res.data : address
            );
            setAddressData(updatedAddresses);
            setIsEditing(false);
            setEditAddress(null);
            toast.success('Address updated successfully!');
        } catch (err) {
            console.error('Error updating address:', err);
            toast.error('Failed to update address.');
        }
    };

    // Delete address
    const deleteAddress = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/addresses/delete/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            const filteredAddresses = addressData.filter((address) => address.id !== id);
            setAddressData(filteredAddresses);
            toast.success('Address deleted successfully!');
        } catch (err) {
            console.error('Error deleting address:', err);
            toast.error('Failed to delete address.');
        }
    };

    // Validate fields
    const validateFields = (data) => {
        const errors = {};

        // First name and last name validation
        if (!data.firstName.trim()) {
            errors.firstName = 'First name is required.';
        }
        if (!data.lastName.trim()) {
            errors.lastName = 'Last name is required.';
        }

        // Mobile validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!data.mobile) {
            errors.mobile = 'Mobile number is required.';
        } else if (!mobileRegex.test(data.mobile)) {
            errors.mobile = 'Mobile number must be exactly 10 digits.';
        }

        // Street address validation
        if (!data.streetAddress.trim()) {
            errors.streetAddress = 'Street address is required.';
        }

        // City and state validation
        if (!data.city.trim()) {
            errors.city = 'City is required.';
        }
        if (!data.state.trim()) {
            errors.state = 'State is required.';
        }

        // ZIP Code validation
        const zipRegex = /^[0-9]{5,6}$/;
        if (!data.zipCode) {
            errors.zipCode = 'ZIP code is required.';
        } else if (!zipRegex.test(data.zipCode)) {
            errors.zipCode = 'ZIP code must be 5 or 6 digits.';
        }

        return errors;
    };

    // Handle add address
    const handleAddAddress = async () => {
        const errors = validateFields(newAddress);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        setErrors({});
        await addAddress();
    };

    // Handle edit address
    const handleUpdateAddress = async () => {
        const errors = validateFields(editAddress);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        setErrors({});
        await updateAddress();
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Saved Addresses ({addressData.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {addressData.map((address) => (
                    <div key={address.id} className="p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {address.firstName} {address.lastName}
                        </h3>
                        <p className="text-gray-600 mt-1">
                            <span className="font-semibold">Mobile: </span>
                            {address.mobile}
                        </p>
                        <p className="text-gray-600 mt-1">
                            <span className="font-semibold">Street Address: </span>
                            {address.streetAddress}
                        </p>
                        <p className="text-gray-600 mt-1">
                            <span className="font-semibold">City: </span>
                            {address.city}
                        </p>
                        <p className="text-gray-600 mt-1">
                            <span className="font-semibold">State: </span>
                            {address.state}
                        </p>
                        <p className="text-gray-600 mt-1">
                            <span className="font-semibold">ZIP Code: </span>
                            {address.zipCode}
                        </p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => {
                                    setEditAddress(address);
                                    setIsEditing(true);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteAddress(address.id)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add or Edit Address Form */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">
                    {isEditing ? 'Edit Address' : 'Add New Address'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['firstName', 'lastName', 'mobile', 'streetAddress', 'city', 'state', 'zipCode']
                        .map((field) => (
                            <div key={field}>
                                <label
                                    htmlFor={field}
                                    className="block text-sm font-medium text-gray-700 capitalize"
                                >
                                    {field.replace(/([A-Z])/g, ' $1')}
                                </label>
                                <input
                                    id={field}
                                    name={field}
                                    type="text"
                                    value={isEditing ? editAddress?.[field] : newAddress[field]}
                                    onChange={(e) =>
                                        isEditing
                                            ? setEditAddress({ ...editAddress, [field]: e.target.value })
                                            : handleInputChange(e)
                                    }
                                    className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                                />
                                {errors[field] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                                )}
                            </div>
                        ))}
                </div>
                <button
                    onClick={isEditing ? handleUpdateAddress : handleAddAddress}
                    className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                    {isEditing ? 'Save Changes' : 'Add Address'}
                </button>
                {isEditing && (
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditAddress(null);
                        }}
                        className="mt-4 ml-4 px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default Address;
