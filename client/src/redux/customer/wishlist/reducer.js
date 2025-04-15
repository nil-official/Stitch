import {
    GET_WISHLIST_PENDING,
    GET_WISHLIST_FULFILLED,
    GET_WISHLIST_REJECTED,
    ADD_TO_WISHLIST_PENDING,
    ADD_TO_WISHLIST_FULFILLED,
    ADD_TO_WISHLIST_REJECTED,
    REMOVE_FROM_WISHLIST_PENDING,
    REMOVE_FROM_WISHLIST_FULFILLED,
    REMOVE_FROM_WISHLIST_REJECTED,
} from './type';

const initialState = {
    wishlist: [],
    loading: false,
    error: null,
};

const wishlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_WISHLIST_PENDING:
            return { ...state, loading: true };
        case GET_WISHLIST_FULFILLED:
            return { ...state, loading: false, wishlist: action.payload };
        case GET_WISHLIST_REJECTED:
            return { ...state, loading: false, error: action.error };
        case ADD_TO_WISHLIST_PENDING:
            return { ...state, loading: true };
        case ADD_TO_WISHLIST_FULFILLED:
            return { ...state, loading: false };
        case ADD_TO_WISHLIST_REJECTED:
            return { ...state, loading: false, error: action.error };
        case REMOVE_FROM_WISHLIST_PENDING:
            return { ...state, loading: true };
        case REMOVE_FROM_WISHLIST_FULFILLED:
            return { ...state, loading: false };
        case REMOVE_FROM_WISHLIST_REJECTED:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default wishlistReducer;