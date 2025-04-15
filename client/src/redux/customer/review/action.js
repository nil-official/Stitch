import { toast } from 'react-toastify'
import axios from '../../../utils/axiosConfig'
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
import { set } from 'date-fns';

const getReviewsPending = () => ({
    type: GET_REVIEWS_PENDING,
});

const getReviewsFulfilled = (reviews) => ({
    type: GET_REVIEWS_FULFILLED,
    payload: reviews,
});

const getReviewsRejected = (error) => ({
    type: GET_REVIEWS_REJECTED,
    error: error,
});

const addReviewPending = () => ({
    type: ADD_REVIEW_PENDING,
});

const addReviewFulfilled = (review) => ({
    type: ADD_REVIEW_FULFILLED,
    payload: review,
});

const addReviewRejected = (error) => ({
    type: ADD_REVIEW_REJECTED,
    error: error,
});

const updateReviewPending = () => ({
    type: UPDATE_REVIEW_PENDING,
});

const updateReviewFulfilled = (review) => ({
    type: UPDATE_REVIEW_FULFILLED,
    payload: review,
});

const updateReviewRejected = (error) => ({
    type: UPDATE_REVIEW_REJECTED,
    error: error,
});

const deleteReviewPending = () => ({
    type: DELETE_REVIEW_PENDING,
});

const deleteReviewFulfilled = (reviewId) => ({
    type: DELETE_REVIEW_FULFILLED,
    payload: reviewId,
});

const deleteReviewRejected = (error) => ({
    type: DELETE_REVIEW_REJECTED,
    error: error,
});

export const getReviews = (productId) => async (dispatch) => {
    dispatch(getReviewsPending())
    try {
        const response = await axios.get(`/api/reviews/product/${productId}`)
        dispatch(getReviewsFulfilled(response.data))
    } catch (error) {
        dispatch(getReviewsRejected(error.response.data.error))
        console.log('Failed to fetch reviews', error)
        toast.error('Failed to fetch reviews')
    }
};

export const addLikeDislike = (reviewId, type) => async (dispatch) => {
    try {
        const response = await axios.post(`/api/reviews/${reviewId}/${type}`)
        dispatch(getReviews(response.data.productId))
    } catch (error) {
        console.log('Failed to like/dislike review', error)
        toast.error('Failed to like/dislike review')
    }
};

export const addReview = (review) => async (dispatch) => {
    dispatch(addReviewPending())
    try {
        const response = await axios.post('/api/reviews/create', review)
        dispatch(addReviewFulfilled(response.data))
        toast.success('Review added successfully!')
    } catch (error) {
        dispatch(addReviewRejected(error.response.data.error))
        console.log('Failed to add review', error)
        toast.error('Failed to add review')
    }
};

export const updateReview = (review) => async (dispatch) => {
    dispatch(updateReviewPending())
    try {
        const response = await axios.put(`/api/reviews/update/${review.id}`, review)
        dispatch(updateReviewFulfilled(response.data))
        toast.success('Review updated successfully!')
    } catch (error) {
        dispatch(updateReviewRejected(error))
        console.log('Failed to update review', error)
        toast.error('Failed to update review')
    }
};

export const deleteReview = (reviewId) => async (dispatch) => {
    dispatch(deleteReviewPending())
    try {
        await axios.delete(`/api/reviews/delete/${reviewId}`)
        dispatch(deleteReviewFulfilled(reviewId))
        toast.success('Review deleted successfully!')
    } catch (error) {
        dispatch(deleteReviewRejected(error))
        console.log('Failed to delete review', error)
        toast.error('Failed to delete review')
    }
};