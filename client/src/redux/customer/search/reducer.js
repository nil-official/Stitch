import {
    GET_SEARCHED_PRODUCTS_PENDING,
    GET_SEARCHED_PRODUCTS_FULFILLED,
    GET_SEARCHED_PRODUCTS_REJECTED,
} from './type';

const initialState = {
    products: null,
    productsLoading: false,
    productsError: null,
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SEARCHED_PRODUCTS_PENDING:
            return { ...state, productsLoading: true };
        case GET_SEARCHED_PRODUCTS_FULFILLED:
            return { ...state, productsLoading: false, products: action.payload };
        case GET_SEARCHED_PRODUCTS_REJECTED:
            return { ...state, productsLoading: false, productsError: action.error };
        default:
            return state;
    }
};

export default searchReducer;