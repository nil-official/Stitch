import {
    GET_REVIEWS_PENDING,
    GET_REVIEWS_FULFILLED,
    GET_REVIEWS_REJECTED,
    ADD_REVIEW_PENDING,
    ADD_REVIEW_FULFILLED,
    ADD_REVIEW_REJECTED,
    UPDATE_REVIEW_PENDING,
    UPDATE_REVIEW_FULFILLED,
    UPDATE_REVIEW_REJECTED,
    DELETE_REVIEW_PENDING,
    DELETE_REVIEW_FULFILLED,
    DELETE_REVIEW_REJECTED,
} from './type'

const initialState = {
    reviews: [],
    stats: [],
    loading: false,
    error: null,
}

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS_PENDING:
            return { ...state, loading: true }
        case GET_REVIEWS_FULFILLED:
            return { ...state, loading: false, reviews: action.payload.reviews, stats: action.payload.stats }
        case GET_REVIEWS_REJECTED:
            return { ...state, loading: false, error: action.error }
        case ADD_REVIEW_PENDING:
            return { ...state, loading: true }
        case ADD_REVIEW_FULFILLED:
            return { ...state, loading: false }
        case ADD_REVIEW_REJECTED:
            return { ...state, loading: false, error: action.error }
        case UPDATE_REVIEW_PENDING:
            return { ...state, loading: true }
        case UPDATE_REVIEW_FULFILLED:
            return {
                ...state,
                loading: false,
                reviews: state.reviews.map((review) =>
                    review.id === action.payload.id ? action.payload : review
                ),
            }
        case UPDATE_REVIEW_REJECTED:
            return { ...state, loading: false, error: action.payload }
        case DELETE_REVIEW_PENDING:
            return { ...state, loading: true }
        case DELETE_REVIEW_FULFILLED:
            return {
                ...state,
                loading: false,
                reviews: state.reviews.filter((review) => review.id !== action.payload.id),
            }
        case DELETE_REVIEW_REJECTED:
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

export default reviewReducer;