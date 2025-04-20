import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import Loader from '../Loader';
import ErrorPage from '../../pages/ErrorPage';
import Confirmation from '../Confirmation';
import AddressForm from '../Address/AddressForm';
import AddressList from '../Address/AddressList';
import { getAddress, addAddress, updateAddress, deleteAddress } from '../../redux/customer/address/action';

const AddressManagement = () => {
    const dispatch = useDispatch();
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
        if (!address) dispatch(getAddress());
    }, [address, dispatch]);

    useEffect(() => {
        if (!profile) dispatch(getProfile());
    }, [profile, dispatch]);

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

    if (addressError || profileError) {
        return <ErrorPage code={400} title='An Error Occurred!' description={addressError || profileError} />;
    };

    if ((!address && addressLoading) || (!profile && profileLoading)) {
        return <Loader />;
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="mb-4">
                <h2 className="text-lg font-medium">Manage Addresses</h2>
            </div>
            <div className='flex flex-col gap-4'>
                <button
                    onClick={handleAddNewAddress}
                    className="w-full p-4 text-md border flex items-center gap-2 rounded-lg text-gray-700 hover:text-gray-800"
                >
                    <Plus size={16} />
                    Add New Address
                </button>

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
                        onEditAddress={handleEditAddress}
                        onDeleteAddress={handleDeleteAddress}
                    />
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        No saved addresses. Please add a new address to continue.
                    </div>
                )}
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

export default AddressManagement;