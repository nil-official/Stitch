import {
    GET_PRODUCT_FILTERS_PENDING,
    GET_PRODUCT_FILTERS_FULFILLED,
    GET_PRODUCT_FILTERS_REJECTED,
} from './searchTypes';

const initialState = {
    filters: null,
    filtersLoading: false,
    filtersError: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_PRODUCT_FILTERS_PENDING:
            return { ...state, filtersLoading: true };
        case GET_PRODUCT_FILTERS_FULFILLED:
            return { ...state, filtersLoading: false, filters: action.payload };
        case GET_PRODUCT_FILTERS_REJECTED:
            return { ...state, filtersLoading: false, filtersError: action.error };
        default:
            return state;
    }
};