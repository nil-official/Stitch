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

const initialState = {
    loading: false,
    user: null,
    isAuthenticated: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                user: null,
                isAuthenticated: false,
                error: null
            };

        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: null,
                isAuthenticated: false,
                error: null
            };

        case LOAD_USER:
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.user,
                isAuthenticated: true,
                error: null
            };

        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                user: null,
                isAuthenticated: false,
                error: action.error
            };

        case LOGOUT:
            return {
                ...state,
                loading: false,
                user: null,
                isAuthenticated: false,
                error: null
            };

        default:
            return state ?? initialState;
    }
};

export default authReducer;