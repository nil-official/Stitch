import React from 'react'

const Loader = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );
};

export default Loader;