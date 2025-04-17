import {
    GET_ADDRESS_PENDING,
    GET_ADDRESS_FULFILLED,
    GET_ADDRESS_REJECTED,
    ADD_ADDRESS_PENDING,
    ADD_ADDRESS_FULFILLED,
    ADD_ADDRESS_REJECTED,
    UPDATE_ADDRESS_PENDING,
    UPDATE_ADDRESS_FULFILLED,
    UPDATE_ADDRESS_REJECTED,
    DELETE_ADDRESS_PENDING,
    DELETE_ADDRESS_FULFILLED,
    DELETE_ADDRESS_REJECTED,
} from './type';

const initialState = {
    address: [],
    loading: false,
    error: null,
};

const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADDRESS_PENDING:
            return { ...state, loading: true, error: null };
        case GET_ADDRESS_FULFILLED:
            return { ...state, loading: false, address: action.payload };
        case GET_ADDRESS_REJECTED:
            return { ...state, loading: false, error: action.error };
        case ADD_ADDRESS_PENDING:
            return { ...state, loading: true, error: null };
        case ADD_ADDRESS_FULFILLED:
            return { ...state, loading: false };
        case ADD_ADDRESS_REJECTED:
            return { ...state, loading: false, error: action.error };
        case UPDATE_ADDRESS_PENDING:
            return { ...state, loading: true, error: null };
        case UPDATE_ADDRESS_FULFILLED:
            return { ...state, loading: false };
        case UPDATE_ADDRESS_REJECTED:
            return { ...state, loading: false, error: action.error };
        case DELETE_ADDRESS_PENDING:
            return { ...state, loading: true, error: null };
        case DELETE_ADDRESS_FULFILLED:
            return { ...state, loading: false };
        case DELETE_ADDRESS_REJECTED:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default addressReducer;