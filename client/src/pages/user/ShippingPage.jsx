import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import ErrorPage from '../ErrorPage';
import Loader from '../../components/Loader';
import Confirmation from '../../components/Confirmation';
import CheckoutSteps from '../../components/CheckoutSteps';
import AccountDetails from '../../components/Shipping/AccountDetails';
import AddressForm from '../../components/Address/AddressForm';
import AddressList from '../../components/Address/AddressList';
import OrderSummary from '../../components/Order/OrderSummary';
import { getCart } from '../../redux/customer/cart/action';
import { getProfile } from '../../redux/customer/profile/action';
import { getAddress, addAddress, updateAddress, deleteAddress } from '../../redux/customer/address/action';

const ShippingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currency, setCurrency] = useState('INR');
    const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
    const { address, loading: addressLoading, error: addressError } = useSelector((state) => state.address);
    const { profile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [newAddress, setNewAddress] = useState({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mobile: '',
        type: 'HOME',
        isDefault: false
    });

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel'
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
        if (cart && cart.totalItem === 0) {
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
            type: 'HOME',
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
            type: addr.type || 'HOME',
            isDefault: addr.isDefault || false
        });
        setShowAddForm(true);
    };

    const handleDeleteAddress = (addressId) => {
        setConfirmation({
            isOpen: true,
            title: "Remove Address",
            message: "Are you sure you want to remove this address? This action cannot be undone.",
            onConfirm: () => {
                if (selectedAddressId === addressId) setSelectedAddressId(null);
                dispatch(deleteAddress(addressId));
                closeConfirmation();
            },
            confirmText: "Remove",
            cancelText: "Cancel"
        });
    };

    const handleAddressChange = (updatedAddress) => {
        setNewAddress(updatedAddress);
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

    const closeConfirmation = () => {
        setConfirmation(prev => ({ ...prev, isOpen: false }));
    };

    if (cartError || addressError || profileError) {
        return <ErrorPage code={400} title='An Error Occurred!' description={cartError || addressError || profileError} />;
    };

    if ((!cart && cartLoading) || (!address && addressLoading) || (!profile && profileLoading)) {
        return <Loader />;
    };

    return (
        <div className="min-h-[60vh] flex flex-col justify-center items-center gap-8 py-8 lg:py-12">
            <CheckoutSteps
                currentStep={2}
                disabledSteps={selectedAddressId ? [4] : [3, 4]}
            />

            <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
                <div className='flex items-center gap-4 mb-6'>
                    <Link to='/user/cart' className="text-gray-600 hover:text-gray-800 transition-all duration-300">
                        <ChevronLeft size={32} />
                    </Link>
                    <p className="text-2xl font-semibold">Shipping Details</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-2/3">
                        {profile && (
                            <AccountDetails
                                profile={profile}
                                onChangeClick={handleAccountChange}
                            />
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
                                    <AddressForm
                                        address={newAddress}
                                        onSubmit={handleSubmit}
                                        onCancel={() => setShowAddForm(false)}
                                        onChange={handleAddressChange}
                                        isEditing={!!editAddressId}
                                    />
                                )}

                                {address && address.length > 0 ? (
                                    <AddressList
                                        addresses={address}
                                        selectedAddressId={selectedAddressId}
                                        onAddressSelect={handleAddressSelect}
                                        onEditAddress={handleEditAddress}
                                        onDeleteAddress={handleDeleteAddress}
                                    />
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        No saved addresses. Please add a new address to continue.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {cart && cart.totalItem > 0 && (
                        <div className="w-full lg:w-1/3">
                            <OrderSummary
                                cart={cart}
                                currency={currency}
                                selectedAddressId={selectedAddressId}
                                checkoutPath="/checkout/summary"
                                disableCheckoutButton={!selectedAddressId}
                                customButtonText={selectedAddressId ? "Continue to Checkout" : "Select Address to Continue"}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Confirmation
                isOpen={confirmation.isOpen}
                onClose={closeConfirmation}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                confirmText={confirmation.confirmText}
                cancelText={confirmation.cancelText}
            />
        </div>
    );
};

export default ShippingPage;