import React from 'react'

const Confirmation = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 m-4">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="text-primary-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3 font-medium">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-primary-300 rounded-md text-primary-700 hover:bg-primary-50 transition-all duration-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white rounded-md bg-error-700 hover:bg-error-600 transition-all duration-300"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;