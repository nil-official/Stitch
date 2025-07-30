import {
    GET_HISTORY_PENDING,
    GET_HISTORY_FULFILLED,
    GET_HISTORY_REJECTED,
    SAVE_HISTORY_PENDING,
    SAVE_HISTORY_FULFILLED,
    SAVE_HISTORY_REJECTED,
    DELETE_HISTORY_PENDING,
    DELETE_HISTORY_FULFILLED,
    DELETE_HISTORY_REJECTED,
} from './type';

const initialState = {
    items: null,
    loading: false,
    error: null,
};

const historyReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HISTORY_PENDING:
        case SAVE_HISTORY_PENDING:
        case DELETE_HISTORY_PENDING:
            return { ...state, loading: true, error: null };

        case GET_HISTORY_FULFILLED:
            return { ...state, loading: false, items: action.items, error: null };

        case SAVE_HISTORY_FULFILLED:
        case DELETE_HISTORY_FULFILLED:
            return { ...state, loading: false, error: null };

        case GET_HISTORY_REJECTED:
        case SAVE_HISTORY_REJECTED:
        case DELETE_HISTORY_REJECTED:
            return { ...state, loading: false, items: null, error: action.error };

        default:
            return state ?? initialState;
    }
};

export default historyReducer;