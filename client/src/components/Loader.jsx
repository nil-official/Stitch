import React from 'react'

const Loader = ({ className = '' }) => {
    return (
        <div className={`${className} flex justify-center items-center`}>
            <div className="loader border-4 border-primary-300 border-t-primary-700 rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );
};

export default Loader;