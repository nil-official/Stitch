import {
    GET_SEARCHED_PRODUCTS_PENDING,
    GET_SEARCHED_PRODUCTS_FULFILLED,
    GET_SEARCHED_PRODUCTS_REJECTED,
} from './type';

const initialState = {
    products: null,
    loading: false,
    error: null,
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SEARCHED_PRODUCTS_PENDING:
            return { ...state, loading: true };
        case GET_SEARCHED_PRODUCTS_FULFILLED:
            return { ...state, loading: false, products: action.payload };
        case GET_SEARCHED_PRODUCTS_REJECTED:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default searchReducer;