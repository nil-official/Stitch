import {
    GET_PROFILE_PENDING,
    GET_PROFILE_FULFILLED,
    GET_PROFILE_REJECTED,
    UPDATE_PROFILE_PENDING,
    UPDATE_PROFILE_FULFILLED,
    UPDATE_PROFILE_REJECTED,
    DELETE_PROFILE_PENDING,
    DELETE_PROFILE_FULFILLED,
    DELETE_PROFILE_REJECTED,
} from './type';

const initialState = {
    profile: null,
    loading: false,
    error: null,
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROFILE_PENDING:
            return { ...state, loading: true, error: null, };
        case GET_PROFILE_FULFILLED:
            return { ...state, loading: false, profile: action.payload, };
        case GET_PROFILE_REJECTED:
            return { ...state, loading: false, error: action.error, };
        case UPDATE_PROFILE_PENDING:
            return { ...state, loading: true, error: null, };
        case UPDATE_PROFILE_FULFILLED:
            return { ...state, loading: false, };
        case UPDATE_PROFILE_REJECTED:
            return { ...state, loading: false, error: action.error, };
        case DELETE_PROFILE_PENDING:
            return { ...state, loading: true, error: null, };
        case DELETE_PROFILE_FULFILLED:
            return { ...state, loading: false, profile: null, };
        case DELETE_PROFILE_REJECTED:
            return { ...state, loading: false, error: action.error, };
        default:
            return state;
    }
};

export default profileReducer;