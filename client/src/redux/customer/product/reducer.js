import {
    GET_PRODUCT_PENDING,
    GET_PRODUCT_FULFILLED,
    GET_PRODUCT_REJECTED,
    UPDATE_PRODUCT_PENDING,
    UPDATE_PRODUCT_FULFILLED,
    UPDATE_PRODUCT_REJECTED,
    DELETE_PRODUCT_PENDING,
    DELETE_PRODUCT_FULFILLED,
    DELETE_PRODUCT_REJECTED,
    GET_SIMILAR_PRODUCTS_PENDING,
    GET_SIMILAR_PRODUCTS_FULFILLED,
    GET_SIMILAR_PRODUCTS_REJECTED,
    CLEAR_SIMILAR_PRODUCTS,
    GET_LIKE_PRODUCTS_PENDING,
    GET_LIKE_PRODUCTS_FULFILLED,
    GET_LIKE_PRODUCTS_REJECTED,
    CLEAR_LIKE_PRODUCTS,
} from './type';

const initialState = {
    product: {},
    similarProducts: { content: [], last: false, pageNumber: 0, loading: false, fetched: false },
    likeProducts: { content: [], last: false, pageNumber: 0, loading: false, fetched: false },
    loading: false,
    error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        // Products actions
        case GET_PRODUCT_PENDING:
            return { ...state, loading: true };
        case GET_PRODUCT_FULFILLED:
            return { ...state, loading: false, product: action.payload };
        case GET_PRODUCT_REJECTED:
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

        // Similar products actions
        case GET_SIMILAR_PRODUCTS_PENDING:
            return {
                ...state,
                similarProducts: { ...state.similarProducts, loading: true, fetched: false },
            };
        case GET_SIMILAR_PRODUCTS_FULFILLED:
            return {
                ...state,
                similarProducts: {
                    ...action.payload,
                    content: [...state.similarProducts.content, ...action.payload.content],
                    loading: false,
                    fetched: true,
                },
            };
        case GET_SIMILAR_PRODUCTS_REJECTED:
            return {
                ...state,
                similarProducts: { ...state.similarProducts, loading: false, fetched: true },
                error: action.payload,
            };
        case CLEAR_SIMILAR_PRODUCTS:
            return {
                ...state,
                similarProducts: { content: [], last: false, pageNumber: 0, fetched: false }
            };

        // Like products actions
        case GET_LIKE_PRODUCTS_PENDING:
            return {
                ...state,
                likeProducts: { ...state.likeProducts, loading: true, fetched: false },
            };
        case GET_LIKE_PRODUCTS_FULFILLED:
            return {
                ...state,
                likeProducts: {
                    ...action.payload,
                    content: [...state.likeProducts.content, ...action.payload.content],
                    loading: false,
                    fetched: true,
                },
            };
        case GET_LIKE_PRODUCTS_REJECTED:
            return {
                ...state,
                likeProducts: { ...state.likeProducts, loading: false, fetched: true, },
                error: action.payload,
            };
        case CLEAR_LIKE_PRODUCTS:
            return {
                ...state,
                likeProducts: { content: [], last: false, pageNumber: 0, fetched: false }
            };

        // Default action
        default:
            return state;
    }
};

export default productReducer;