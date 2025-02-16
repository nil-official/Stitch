import React from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../utils/baseurl";

const Error404 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <h1 className="text-6xl font-extrabold text-red-500">404</h1>
                <p className="mt-4 text-2xl text-gray-800 font-semibold">Oops! Page not found</p>
                <p className="mt-2 text-gray-600">The page you're looking for doesn't exist or has been moved.</p>

                {/* <img
                    src={`${BASE_URL}/assets/404-illustration.png`}
                    alt="404 Illustration"
                    className="w-72 mt-6 mx-auto"
                /> */}

                <div className="mt-8">
                    <Link
                        to="/"
                        className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Error404;
