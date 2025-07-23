import { toast } from 'react-hot-toast';
import axios from '../../utils/axiosConfig';
import {
    LOAD_USER,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
} from "./type";
import { getToken, getUserFromToken, setToken, removeToken } from '../../utils/auth';

export const loadUser = () => dispatch => {
    const user = getUserFromToken();
    if (user) {
        dispatch({ type: LOAD_USER, user: user });
    }
};

export const register = (formData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const res = await axios.post('/auth/register', formData);
        if (res.status === 201) {
            dispatch({ type: REGISTER_SUCCESS });
            return { success: true, status: res.status };
        }
    } catch (error) {
        dispatch({ type: REGISTER_FAILURE, error: error.response?.data?.error || "Registration failed. Please try again" });
    }
};

export const login = (formData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const res = await axios.post('/auth/login', formData);
        if (res.status === 200) {
            setToken(res.data.token);
            dispatch({ type: LOGIN_SUCCESS, user: res.data.user });
        }
    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, error: error.response?.data?.error || "Login failed. Please try again" });
    }
};

export const logout = () => async (dispatch) => {
    removeToken();
    dispatch({ type: LOGOUT });
    toast.success("You have been logged out.");
};