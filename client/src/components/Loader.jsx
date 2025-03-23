import React from 'react'

const Loader = ({ minHeight }) => {
    console.log(minHeight);
    
    return (
        <div className={`flex justify-center items-center min-h-[46vh]`}>
            <div className="loader border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 animate-spin">{minHeight}</div>
        </div>
    )
}

export default Loader;