import React from 'react'
import { Link } from 'react-router-dom';

const ErrorPage = ({ code = 404, title = "Oops! Page not found.", description = "The page you're looking for doesn't exist or has been moved." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <h1 className="text-6xl font-extrabold text-error-light">{code}</h1>
                <p className="mt-4 text-2xl text-primary font-semibold">{title}</p>
                <p className="mt-2 text-primary-light">{description}</p>
                <div className="mt-8">
                    <Link
                        to="/"
                        className="py-2 px-6 text-white rounded-md bg-primary hover:bg-primary-dark transition-all duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;