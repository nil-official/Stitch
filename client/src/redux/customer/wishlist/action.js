import { toast } from 'react-hot-toast';
import axios from "../../../utils/axiosConfig";
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

const getWishlistPending = () => ({
    type: GET_WISHLIST_PENDING,
});

const getWishlistFulfilled = (wishlist) => ({
    type: GET_WISHLIST_FULFILLED,
    payload: wishlist,
});

const getWishlistRejected = (error) => ({
    type: GET_WISHLIST_REJECTED,
    error: error,
});

const addToWishlistPending = () => ({
    type: ADD_TO_WISHLIST_PENDING,
});

const addToWishlistFulfilled = () => ({
    type: ADD_TO_WISHLIST_FULFILLED,
});

const addToWishlistRejected = (error) => ({
    type: ADD_TO_WISHLIST_REJECTED,
    error: error,
});

const removeFromWishlistPending = () => ({
    type: REMOVE_FROM_WISHLIST_PENDING,
});

const removeFromWishlistFulfilled = () => ({
    type: REMOVE_FROM_WISHLIST_FULFILLED,
});

const removeFromWishlistRejected = (error) => ({
    type: REMOVE_FROM_WISHLIST_REJECTED,
    error: error,
});

export const getWishlist = () => async (dispatch) => {
    dispatch(getWishlistPending());
    try {
        const response = await axios.get("/api/user/wishlist");
        dispatch(getWishlistFulfilled(response.data.wishlistItems));
    } catch (error) {
        dispatch(getWishlistRejected(error.response.data.error));
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to fetch wishlist items");
    }
};

export const addToWishlist = (productId) => async (dispatch) => {
    dispatch(addToWishlistPending());
    try {
        const response = await axios.post(`/api/user/wishlist/${productId}`);
        dispatch(addToWishlistFulfilled());
        dispatch(getWishlist());
    } catch (error) {
        dispatch(addToWishlistRejected(error.response.data.error));
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add product to wishlist");
    }
};

export const removeFromWishlist = (productId) => async (dispatch) => {
    dispatch(removeFromWishlistPending());
    try {
        const response = await axios.delete(`/api/user/wishlist/${productId}`);
        dispatch(removeFromWishlistFulfilled());
        dispatch(getWishlist());
    } catch (error) {
        dispatch(removeFromWishlistRejected(error.response.data.error));
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove product from wishlist");
    }
};

export const removeItemFromWishlist = (itemId) => async (dispatch) => {
    dispatch(removeFromWishlistPending());
    try {
        const response = await axios.delete(`/api/user/wishlist/id/${itemId}`);
        dispatch(removeFromWishlistFulfilled());
        dispatch(getWishlist());
        toast.success(response.data.message);
    } catch (error) {
        dispatch(removeFromWishlistRejected(error.response.data.error));
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove product from wishlist");
    }
};