import React from 'react'
import { useNavigate } from 'react-router-dom';

const EmptyPage = ({ image, title, description, button, navigation }) => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-center rounded-lg p-6">
            <img
                src={image}
                alt={title}
                className="p-6 w-52 h-52 object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {title}
            </h2>
            <p className="text-gray-500 mb-10">
                {description}
            </p>
            <button
                onClick={() => navigate(navigation)}
                className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 mb-20"
            >
                {button}
            </button>
        </div>
    );
};

export default EmptyPage;