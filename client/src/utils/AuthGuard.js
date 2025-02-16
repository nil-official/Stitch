import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const checkJwtExpiration = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return payload.exp && payload.exp < currentTime; // Check if expired
    } catch (error) {
        console.error('Invalid JWT:', error);
        return true; // Treat invalid tokens as expired
    }
};

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (checkJwtExpiration()) {
            if (!localStorage.getItem("sessionExpired")) {
                localStorage.setItem("sessionExpired", "true"); // Set flag to prevent duplicate toast
                toast.error("Session Expired! Log in Again");
            }
            navigate("/login");
        } else {
            localStorage.removeItem("sessionExpired"); // Reset flag if session is valid
        }
    }, [navigate]);

    return children;
};

export default AuthGuard;