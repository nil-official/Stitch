import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAINTENANCE } from '../assets/asset';

const MaintenancePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/');
        }, 30000);
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="max-w-2xl text-center">
                {/* Maintenance Image */}
                <img
                    src={MAINTENANCE}
                    alt="Maintenance"
                    className="w-48 h-48 mx-auto mb-6"
                />

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Under Maintenance
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                    Sorry, the server is currently unavailable. We're working hard to bring
                    it back online. Please check back later.
                </p>

                {/* Contact Support */}
                <p className="text-gray-500 text-sm">
                    If you need immediate assistance, please contact{' '}
                    <a
                        href="mailto:support@example.com"
                        className="text-blue-500 hover:underline"
                    >
                        stitch.notifications@gmail.com
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;