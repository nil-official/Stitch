import React from 'react'

const Loader = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="loader border-4 border-primary-light-2x border-t-primary rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );
};

export default Loader;