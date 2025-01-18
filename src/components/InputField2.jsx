import React from 'react';

const InputField2 = ({ label, type = "text", value, onChange, name }) => {
    return (
        // <div className={`sm:col-span-${span}`}>
        <>
            <label htmlFor={name} className="block text-sm/6 font-medium text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={name}
                    name={name}
                    type={type}
                    onChange={onChange}
                    value={value}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
            </div>
        </>
        // </div>
    )
}

export default InputField2;
