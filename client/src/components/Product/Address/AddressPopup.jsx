import { Check, X } from 'lucide-react';

const AddressPopup = ({ showAddressModal, address, selectedAddress, onSetShowAddressModal, onSetSelectedAddress }) => {

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.streetAddress}, ${addr.city}, ${addr.state} - ${addr.zipCode}`;
    };

    return (
        showAddressModal && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col p-6 m-4'>
                    {/* Modal Header */}
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-base md:text-lg font-semibold text-gray-900'>Select Delivery Address</h2>
                        <button
                            onClick={() => onSetShowAddressModal(false)}
                        >
                            <X className='w-5 h-5 md:w-6 md:h-6 text-primary-800' />
                        </button>
                    </div>

                    {/* Address List */}
                    <div className='overflow-y-auto flex-1'>
                        <div className='space-y-3'>
                            {address && address.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => {
                                        onSetSelectedAddress(addr);
                                        onSetShowAddressModal(false);
                                    }}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedAddress?.id === addr.id
                                        ? 'border-primary-800 bg-primary-50'
                                        : 'border-gray-200 hover:bg-primary-50'
                                        }`}
                                >
                                    <div className='flex items-start justify-between gap-3'>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <p className='font-semibold text-gray-900 text-sm md:text-base'>
                                                    {addr.firstName} {addr.lastName}
                                                </p>
                                                {addr.isDefault && (
                                                    <span className='px-2 py-0.5 bg-blue-100 text-blue-700 text-xxs md:text-xs font-medium rounded'>
                                                        DEFAULT
                                                    </span>
                                                )}
                                                <span className='px-2 py-0.5 bg-gray-100 text-gray-700 text-xxs md:text-xs font-medium rounded'>
                                                    {addr.type}
                                                </span>
                                            </div>
                                            <p className='text-gray-700 text-xs md:text-base mb-1'>
                                                {formatAddress(addr)}
                                            </p>
                                            <p className='text-gray-600 text-xs md:text-base'>
                                                Mobile: {addr.mobile}
                                            </p>
                                        </div>
                                        {selectedAddress?.id === addr.id && (
                                            <div className='hidden md:block flex-shrink-0'>
                                                <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                                                    <Check className='w-4 h-4 text-white' />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ));
};

export default AddressPopup;