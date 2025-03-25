import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import healthCheck from '../utils/healthCheck';
import MaintenancePage from '../pages/MaintenancePage';

const HealthCheckWrapper = ({ children }) => {

    const navigate = useNavigate();
    const [isBackendUp, setIsBackendUp] = useState(true);

    useEffect(() => {
        const checkHealth = async () => {
            const isHealthy = await healthCheck();
            setIsBackendUp(isHealthy);
            if (!isHealthy) {
                navigate('/maintainance');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, [navigate]);

    if (!isBackendUp) {
        return <MaintenancePage />;
    }

    return children;
};

export default HealthCheckWrapper;