import React from "react";
import { Link } from "react-router-dom";

const ErrorEncountered = ({ message = "Something went wrong! Please try again later." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <h1 className="text-5xl font-extrabold text-red-500">Error</h1>
                <p className="mt-4 text-2xl text-gray-800 font-semibold">An unexpected error occurred!</p>
                <p className="mt-2 text-gray-600">Error: {message}</p>
                <div className="mt-8">
                    <Link
                        to="/"
                        className="bg-gray-800 text-white py-2 px-6 rounded-md duration-300 hover:bg-gray-700"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorEncountered;