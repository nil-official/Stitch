import React from 'react'
import { Link } from 'react-router-dom';

const ErrorPage = ({ code = 404, title = "Oops! Page not found.", description = "The page you're looking for doesn't exist or has been moved." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <h1 className="text-3xl md:text-6xl font-extrabold text-error-600">{code}</h1>
                <p className="mt-2 md:mt-4 text-xl md:text-2xl text-primary-700 font-semibold">{title}</p>
                <p className="mt-1 md:mt-2 text-sm md:text-base text-primary-600">{description}</p>
                <div className="mt-6 md:mt-8">
                    <Link
                        to="/"
                        className="py-2 px-4 md:px-6 text-sm md:text-base text-white rounded-md bg-primary-700 hover:bg-primary-800 transition-all duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;