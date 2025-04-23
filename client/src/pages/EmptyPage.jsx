import { ChevronLeft } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

const EmptyPage = ({ heading, image, title, description, button, forwardNav = '/', backwardNav = '/' }) => {
    return (
        <div className='min-h-[60vh] flex flex-col items-center gap-8 py-8 lg:py-12'>
            <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
                <div className='flex items-center gap-4 mb-6'>
                    <Link to={backwardNav} className="text-primary hover:text-primary-dark transition-all duration-300">
                        <ChevronLeft size={32} />
                    </Link>
                    <p className="text-2xl font-semibold">{heading} (0 items)</p>
                </div>

                <div className="flex flex-col items-center justify-center text-center rounded-lg">
                    <img
                        src={image}
                        alt={title}
                        className="h-40 object-contain"
                    />
                    <h2 className="text-2xl font-bold text-primary mb-2">
                        {title}
                    </h2>
                    <p className="text-primary-light mb-10">
                        {description}
                    </p>
                    <Link to={forwardNav}>
                        <button className="py-2 px-6 text-white rounded-md bg-primary hover:bg-primary-dark transition-all duration-300">
                            {button}
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;