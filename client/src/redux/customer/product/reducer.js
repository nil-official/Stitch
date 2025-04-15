import {
    GET_PRODUCT_PENDING,
    GET_PRODUCT_FULFILLED,
    GET_PRODUCT_REJECTED,
    GET_SIMILAR_PRODUCTS_PENDING,
    GET_SIMILAR_PRODUCTS_FULFILLED,
    GET_SIMILAR_PRODUCTS_REJECTED,
    GET_LIKE_PRODUCTS_PENDING,
    GET_LIKE_PRODUCTS_FULFILLED,
    GET_LIKE_PRODUCTS_REJECTED,
    UPDATE_PRODUCT_PENDING,
    UPDATE_PRODUCT_FULFILLED,
    UPDATE_PRODUCT_REJECTED,
    DELETE_PRODUCT_PENDING,
    DELETE_PRODUCT_FULFILLED,
    DELETE_PRODUCT_REJECTED,
} from './type';

const initialState = {
    product: {},
    similarProducts: [],
    likeProducts: [],
    loading: false,
    error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRODUCT_PENDING:
            return { ...state, loading: true };
        case GET_PRODUCT_FULFILLED:
            return { ...state, loading: false, product: action.payload };
        case GET_PRODUCT_REJECTED:
            return { ...state, loading: false, error: action.error };
        case GET_SIMILAR_PRODUCTS_PENDING:
            return { ...state, loading: true };
        case GET_SIMILAR_PRODUCTS_FULFILLED:
            return { ...state, loading: false, similarProducts: action.payload };
        case GET_SIMILAR_PRODUCTS_REJECTED:
            return { ...state, loading: false, error: action.error };
        case GET_LIKE_PRODUCTS_PENDING:
            return { ...state, loading: true };
        case GET_LIKE_PRODUCTS_FULFILLED:
            return { ...state, loading: false, likeProducts: action.payload };
        case GET_LIKE_PRODUCTS_REJECTED:
            return { ...state, loading: false, error: action.error };
        case UPDATE_PRODUCT_PENDING:
            return { ...state, loading: true };
        case UPDATE_PRODUCT_FULFILLED:
            return { ...state, loading: false, product: action.payload };
        case UPDATE_PRODUCT_REJECTED:
            return { ...state, loading: false, error: action.payload };
        case DELETE_PRODUCT_PENDING:
            return { ...state, loading: true };
        case DELETE_PRODUCT_FULFILLED:
            return { ...state, loading: false, product: {} };
        case DELETE_PRODUCT_REJECTED:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default productReducer;