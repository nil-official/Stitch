import {
    GET_HOME_PRODUCTS_PENDING,
    GET_HOME_PRODUCTS_FULFILLED,
    GET_HOME_PRODUCTS_REJECTED,
} from './type';

const initialState = {
    products: {},
    loading: false,
    error: null,
};

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HOME_PRODUCTS_PENDING:
            return { ...state, loading: true };
        case GET_HOME_PRODUCTS_FULFILLED:
            return { ...state, loading: false, products: action.payload };
        case GET_HOME_PRODUCTS_REJECTED:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default homeReducer;