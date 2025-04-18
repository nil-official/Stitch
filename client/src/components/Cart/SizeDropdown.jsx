import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SizeDropdown = ({ sizes, currentSize, onSizeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    // Filter out sizes with quantity 0
    const availableSizes = sizes.filter(size => size.quantity > 0);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (size) => {
        onSizeChange(size.name);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{currentSize}</span>
                {isOpen ? (
                    <ChevronUp size={16} className="ml-2" />
                ) : (
                    <ChevronDown size={16} className="ml-2" />
                )}
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1 max-h-48 overflow-auto">
                        {availableSizes.map((size) => (
                            <li
                                key={size.name}
                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${currentSize === size.name ? 'bg-gray-100' : ''
                                    }`}
                                onClick={() => handleSelect(size)}
                            >
                                {size.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SizeDropdown;