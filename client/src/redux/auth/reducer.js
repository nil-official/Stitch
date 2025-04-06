import {
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    RESET_JUST_LOGGED_IN,
} from "./type";

const initialState = {
    token: localStorage.getItem("jwtToken") || null,
    loading: false,
    error: null,
    message: null,
    justLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
            return { ...state, loading: true, error: null };
        case REGISTER_SUCCESS:
            return { ...state, loading: false, message: action.payload };
        case REGISTER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, token: action.payload, justLoggedIn: true };
        case LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case LOGOUT:
            return { ...state, token: null, justLoggedIn: false };
        case RESET_JUST_LOGGED_IN:
            return { ...state, justLoggedIn: false };
        default:
            return state;
    }
};

export default authReducer;