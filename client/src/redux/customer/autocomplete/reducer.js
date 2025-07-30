import {
    GET_AUTOCOMPLETE_PENDING,
    GET_AUTOCOMPLETE_FULFILLED,
    GET_AUTOCOMPLETE_REJECTED,
} from './type';

const initialState = {
    items: null,
    loading: false,
    error: null,
};

const autocompleteReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_AUTOCOMPLETE_PENDING:
            return { ...state, loading: true, error: null };
        case GET_AUTOCOMPLETE_FULFILLED:
            return { ...state, loading: false, items: action.items, error: null };
        case GET_AUTOCOMPLETE_REJECTED:
            return { ...state, loading: false, items: null, error: action.error };
        default:
            return state ?? initialState;
    }
};

export default autocompleteReducer;