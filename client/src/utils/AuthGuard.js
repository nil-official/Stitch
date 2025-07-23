import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/auth/action";
import { getToken } from "./auth";

const checkJwtExpiration = () => {
    const token = getToken();
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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (checkJwtExpiration()) {
            dispatch(logout());
            navigate("/");
        }
    }, [navigate]);

    return children;
};

export default AuthGuard;