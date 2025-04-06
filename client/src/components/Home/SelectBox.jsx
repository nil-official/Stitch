import React from 'react';

const SelectBox = ({ label, name, options, placeholder, onChange }) => {
    return (
        <div className="flex flex-col">
            <label className="font-semibold text-lg text-white mb-1">{label}</label>
            <select
                name={name}
                onChange={onChange}
                className="w-full p-2 border border-white/40 rounded-lg bg-white/10 backdrop-blur-md text-white focus:outline-none focus:border-white transition-all appearance-none"
            >
                <option className="bg-black/50 text-white" value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} className="bg-black/50 text-white" value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectBox;