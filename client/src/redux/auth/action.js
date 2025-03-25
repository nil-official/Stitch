import axios from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import {
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
} from "./type";

export const register = (firstName, lastName, email, password) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const res = await axios.post('/auth/signup', {
            firstName,
            lastName,
            email,
            password,
        });
        dispatch({ type: REGISTER_SUCCESS, payload: res.data.message });
    } catch (error) {
        dispatch({
            type: REGISTER_FAILURE,
            payload: error.response?.data?.error || "Registration failed. Please try again",
        });
    }
};

export const login = (email, password) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const res = await axios.post('/auth/signin', { email, password });
        localStorage.setItem("jwtToken", res.data.jwt);
        dispatch({ type: LOGIN_SUCCESS, payload: res.data.jwt });
    } catch (error) {
        dispatch({
            type: LOGIN_FAILURE,
            payload: error.response?.data?.error || "Login failed. Please try again",
        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem("jwtToken");
    dispatch({ type: LOGOUT });
    toast.success("Logged out successfully");
};