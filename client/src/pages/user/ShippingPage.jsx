import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Pencil, Plus, CheckCircle, TrashIcon } from 'lucide-react';
import CheckoutSteps from '../../components/CheckoutSteps';
import { getCart } from '../../redux/customer/cart/action';
import { getProfile } from '../../redux/customer/profile/action';
import { getAddress, addAddress, updateAddress, deleteAddress } from '../../redux/customer/address/action';
import Loader from '../../components/Loader';

const ShippingPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currency, setCurrency] = useState('INR');
    const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
    const { address, loading: addressLoading, error: addressError } = useSelector((state) => state.address);
    const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mobile: '',
        type: 'home',
        isDefault: false
    });

    useEffect(() => {
        if (!cart) dispatch(getCart());
    }, [cart, dispatch]);

    useEffect(() => {
        if (!address) dispatch(getAddress());
    }, [address, dispatch]);

    useEffect(() => {
        if (!profile) dispatch(getProfile());
    }, [profile, dispatch]);

    useEffect(() => {
        if (cart && cart.cartItems && cart.cartItems.length === 0) {
            navigate('/user/cart');
        }
    }, [cart, navigate]);

    useEffect(() => {
        if (address && address.length > 0) {
            const defaultAddress = address.find(addr => addr.isDefault === true);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            }
        }
        if (profile && !showAddForm) {
            setNewAddress(prev => ({
                ...prev,
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                mobile: profile.mobile || ''
            }));
        }
    }, [address, profile, showAddForm]);

    const handleAccountChange = () => {
        console.log('Account change clicked');
    };

    const handleAddressSelect = (id) => {
        setSelectedAddressId(id);
    };

    const handleAddNewAddress = () => {
        setEditAddressId(null);
        setNewAddress({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            mobile: profile?.mobile || '',
            type: 'home',
            isDefault: false
        });
        setShowAddForm(true);
    };

    const handleEditAddress = (addr) => {
        setEditAddressId(addr.id);
        setNewAddress({
            firstName: addr.firstName,
            lastName: addr.lastName,
            streetAddress: addr.streetAddress,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            mobile: addr.mobile,
            type: addr.type || 'home',
            isDefault: addr.isDefault || false
        });
        setShowAddForm(true);
    };

    const handleDeleteAddress = (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            dispatch(deleteAddress(addressId));
        }
    };

    const handleDeleteConfirm = (addressId) => {
        dispatch(deleteAddress(addressId));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedAddress = { ...newAddress };
        if (editAddressId) {
            dispatch(updateAddress(editAddressId, updatedAddress));
            if (updatedAddress.isDefault) {
                setSelectedAddressId(editAddressId);
            }
        } else {
            dispatch(addAddress(updatedAddress));
        }
        setShowAddForm(false);
    };

    if (cartError || addressError || profileError) {
        return <ErrorPage code={400} title='An Error Occurred!' description={cartError || addressError || profileError} />;
    };

    if ((!cart && cartLoading) || (!address && addressLoading) || (!profile && profileLoading)) {
        return <Loader />;
    };

    return (
        <div className="min-h-[60vh] flex justify-center">
            <div className="w-11/12 xl:w-5/6 2xl:w-3/4 py-8">
                {/* <CheckoutSteps activeStep={1} /> */}
                <p className="text-2xl font-semibold mb-6">Shipping Details</p>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-2/3">
                        {profile && (
                            <div className="rounded-lg shadow-sm mb-6">
                                <div className='p-4 bg-gray-50 border-b border-gray-200 rounded-t-md'>
                                    <h2 className="font-semibold">Account Details</h2>
                                </div>
                                <div className="flex justify-between items-center p-4">
                                    <div className='flex flex-col gap-1'>
                                        <p className='font-medium'>{profile.firstName} {profile.lastName}</p>
                                        <p>{profile.email}</p>
                                    </div>
                                    <button
                                        onClick={handleAccountChange}
                                        className="border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="rounded-lg shadow-sm">
                            <div className='p-4 bg-gray-50 border-b border-gray-200 rounded-t-md'>
                                <h2 className="font-semibold">Select Delivery Address</h2>
                            </div>

                            <div className='flex flex-col gap-4 p-4'>
                                <div className=''>
                                    <button
                                        onClick={handleAddNewAddress}
                                        className="w-full p-4 border flex items-center gap-2 rounded-lg text-gray-700 hover:text-gray-800"
                                    >
                                        <Plus size={16} />
                                        Add New Address
                                    </button>
                                </div>

                                {showAddForm && (
                                    <div className="rounded-lg bg-gray-50 p-6">
                                        <h3 className="text-md font-medium mb-3">
                                            {editAddressId ? 'Edit Address' : 'Add New Address'}
                                        </h3>
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={newAddress.firstName}
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
                                                        value={newAddress.lastName}
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
                                                        value={newAddress.mobile}
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
                                                        value={newAddress.zipCode}
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
                                                        value={newAddress.streetAddress}
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
                                                        value={newAddress.city}
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
                                                        value={newAddress.state}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                                                    <select
                                                        name="type"
                                                        value={newAddress.type}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    >
                                                        <option value="home">Home (All day delivery)</option>
                                                        <option value="office">Office (10 AM - 5 PM delivery)</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center mt-4">
                                                    <input
                                                        type="checkbox"
                                                        id="default-address"
                                                        name="isDefault"
                                                        checked={newAddress.isDefault}
                                                        onChange={handleInputChange}
                                                        className="h-4 w-4 text-gray-700 focus:ring-2 focus:ring-gray-500"
                                                    />
                                                    <label htmlFor="default-address" className="ml-2 block text-sm text-gray-700">
                                                        Set as default address
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-all duration-300"
                                                >
                                                    {editAddressId ? 'Update Address' : 'Save Address'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddForm(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-all duration-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {address && address.length > 0 ? (
                                    <div className="space-y-4">
                                        {address.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className={`bg-white border rounded-lg p-4 cursor-pointer ${selectedAddressId === addr.id ? 'border-gray-700' : 'border-gray-200'
                                                    }`}
                                                onClick={() => handleAddressSelect(addr.id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1">
                                                            {selectedAddressId === addr.id ? (
                                                                <CheckCircle size={20} className="text-gray-700" />
                                                            ) : (
                                                                <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                                                            )}
                                                        </div>
                                                        <div className='flex flex-col gap-3'>
                                                            <div className='flex gap-3'>
                                                                {addr.isDefault && (
                                                                    <span className='bg-gray-100 text-sm px-2 py-1 rounded-md'>
                                                                        Default
                                                                    </span>
                                                                )}
                                                                <span className='bg-gray-100 text-sm px-2 py-1 rounded-md'>
                                                                    {addr.type.charAt(0).toUpperCase() + addr.type.slice(1).toLowerCase()}
                                                                </span>
                                                                <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                                                                <p className="text-gray-600">{addr.mobile}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-600">{addr.streetAddress}</p>
                                                                <p className="text-gray-600">{addr.city}, {addr.state}, {addr.zipCode}</p>
                                                            </div>

                                                            {selectedAddressId === addr.id && (
                                                                <Link to="/checkout/summary">
                                                                    <button className="px-8 py-2 text-white bg-gray-700 hover:bg-gray-800 rounded transition duration-300">
                                                                        Deliver Here
                                                                    </button>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex space-x-2 mb-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditAddress(addr);
                                                                }}
                                                                className="text-gray-600 hover:text-gray-800"
                                                                aria-label="Edit address"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteAddress(addr.id);
                                                                }}
                                                                className="text-gray-600 hover:text-gray-800"
                                                                aria-label="Delete address"
                                                            >
                                                                <TrashIcon size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No saved addresses. Please add a new address to continue.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({cart.totalItem} items)</span>
                                    <span>{currency} {cart.totalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="text-green-600">-{currency} {cart.discount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery</span>
                                    <span>Free</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between font-semibold">
                                    <span>Total Amount</span>
                                    <span>{currency} {cart.totalDiscountedPrice}</span>
                                </div>
                                <div className="text-sm text-green-600 mt-1 text-right">
                                    You save {currency} {cart.discount} on this order
                                </div>
                            </div>

                            {selectedAddressId ? (
                                <Link to="/checkout/summary">
                                    <button
                                        className="block w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition-all duration-300"
                                    >
                                        Continue to Checkout
                                    </button>
                                </Link>
                            ) : (
                                <button
                                    className="block w-full bg-gray-400 text-white py-2 rounded"
                                    disabled
                                >
                                    Select Address to Continue
                                </button>
                            )}

                            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                                <ShieldCheck size={28} />
                                <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;