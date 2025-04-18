import {
    GET_CART_PENDING,
    GET_CART_FULFILLED,
    GET_CART_REJECTED,
    ADD_TO_CART_PENDING,
    ADD_TO_CART_FULFILLED,
    ADD_TO_CART_REJECTED,
    CLEAR_CART_PENDING,
    CLEAR_CART_FULFILLED,
    CLEAR_CART_REJECTED,
    UPDATE_CART_PENDING,
    UPDATE_CART_FULFILLED,
    UPDATE_CART_REJECTED,
    REMOVE_FROM_CART_PENDING,
    REMOVE_FROM_CART_FULFILLED,
    REMOVE_FROM_CART_REJECTED,
} from './type';

const initialState = {
    cart: {},
    loading: false,
    error: null,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CART_PENDING:
            return { ...state, loading: true };
        case GET_CART_FULFILLED:
            return { ...state, loading: false, cart: action.payload };
        case GET_CART_REJECTED:
            return { ...state, loading: false, error: action.error };
        case ADD_TO_CART_PENDING:
            return { ...state, loading: true };
        case ADD_TO_CART_FULFILLED:
            return { ...state, loading: false };
        case ADD_TO_CART_REJECTED:
            return { ...state, loading: false, error: action.error };
        case CLEAR_CART_PENDING:
            return { ...state, loading: true };
        case CLEAR_CART_FULFILLED:
            return { ...state, loading: false };
        case CLEAR_CART_REJECTED:
            return { ...state, loading: false, error: action.error };
        case UPDATE_CART_PENDING:
            return { ...state, loading: true };
        case UPDATE_CART_FULFILLED:
            return { ...state, loading: false };
        case UPDATE_CART_REJECTED:
            return { ...state, loading: false, error: action.error };
        case REMOVE_FROM_CART_PENDING:
            return { ...state, loading: true };
        case REMOVE_FROM_CART_FULFILLED:
            return { ...state, loading: false };
        case REMOVE_FROM_CART_REJECTED:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default cartReducer;