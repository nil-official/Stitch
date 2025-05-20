import {
    GET_SEARCH_SUGGESTIONS_PENDING,
    GET_SEARCH_SUGGESTIONS_FULFILLED,
    GET_SEARCH_SUGGESTIONS_REJECTED,
    GET_SEARCH_HISTORY_PENDING,
    GET_SEARCH_HISTORY_FULFILLED,
    GET_SEARCH_HISTORY_REJECTED,
    GET_AUTOCOMPLETE_PENDING,
    GET_AUTOCOMPLETE_FULFILLED,
    GET_AUTOCOMPLETE_REJECTED,
    ADD_SEARCH_SUGGESTIONS_PENDING,
    ADD_SEARCH_SUGGESTIONS_FULFILLED,
    ADD_SEARCH_SUGGESTIONS_REJECTED,
    REMOVE_SEARCH_SUGGESTIONS_PENDING,
    REMOVE_SEARCH_SUGGESTIONS_FULFILLED,
    REMOVE_SEARCH_SUGGESTIONS_REJECTED,
    CLEAR_SEARCH_SUGGESTIONS_PENDING,
    CLEAR_SEARCH_SUGGESTIONS_FULFILLED,
    CLEAR_SEARCH_SUGGESTIONS_REJECTED,
} from './type';

const initialState = {
    suggestions: null,
    loading: false,
    error: null,
};

const suggestionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SEARCH_SUGGESTIONS_PENDING:
            return { ...state, loading: true };
        case GET_SEARCH_SUGGESTIONS_FULFILLED:
            return { ...state, loading: false, suggestions: action.payload };
        case GET_SEARCH_SUGGESTIONS_REJECTED:
            return { ...state, loading: false, error: action.error };
        case GET_SEARCH_HISTORY_PENDING:
            return { ...state, loading: true };
        case GET_SEARCH_HISTORY_FULFILLED:
            return { ...state, loading: false, suggestions: action.payload };
        case GET_SEARCH_HISTORY_REJECTED:
            return { ...state, loading: false, error: action.error };
        case GET_AUTOCOMPLETE_PENDING:
            return { ...state, loading: true };
        case GET_AUTOCOMPLETE_FULFILLED:
            return { ...state, loading: false, suggestions: action.payload };
        case GET_AUTOCOMPLETE_REJECTED:
            return { ...state, loading: false, error: action.error };
        case ADD_SEARCH_SUGGESTIONS_PENDING:
            return { ...state, loading: true };
        case ADD_SEARCH_SUGGESTIONS_FULFILLED:
            return { ...state, loading: false };
        case ADD_SEARCH_SUGGESTIONS_REJECTED:
            return { ...state, loading: false, error: action.error };
        case REMOVE_SEARCH_SUGGESTIONS_PENDING:
            return { ...state, loading: true };
        case REMOVE_SEARCH_SUGGESTIONS_FULFILLED:
            return { ...state, loading: false };
        case REMOVE_SEARCH_SUGGESTIONS_REJECTED:
            return { ...state, loading: false, error: action.error };
        case CLEAR_SEARCH_SUGGESTIONS_PENDING:
            return { ...state, loading: true };
        case CLEAR_SEARCH_SUGGESTIONS_FULFILLED:
            return { ...state, loading: false };
        case CLEAR_SEARCH_SUGGESTIONS_REJECTED:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default suggestionsReducer;