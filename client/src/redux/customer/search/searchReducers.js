import {
    GET_PRODUCTS_PENDING,
    GET_PRODUCTS_FULFILLED,
    GET_PRODUCTS_REJECTED,
} from './searchTypes';

const initialState = {
    products: null,
    filters: null,
    loading: false,
    error: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_PRODUCTS_PENDING:
            return { ...state, loading: true };
        case GET_PRODUCTS_FULFILLED:
            return { ...state, products: action.products, filters: action.filters, loading: false };
        case GET_PRODUCTS_REJECTED:
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};