import axios from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import {
    GET_CART_PENDING,
    GET_CART_FULFILLED,
    GET_CART_REJECTED,
    ADD_TO_CART_PENDING,
    ADD_TO_CART_FULFILLED,
    ADD_TO_CART_REJECTED,
    CLEAR_CART_PENDING,
    CLEAR_CART_FULFILLED,
    CLEAR_CART_REJECTED,
    UPDATE_CART_PENDING,
    UPDATE_CART_FULFILLED,
    UPDATE_CART_REJECTED,
    REMOVE_FROM_CART_PENDING,
    REMOVE_FROM_CART_FULFILLED,
    REMOVE_FROM_CART_REJECTED,
} from './type';

const getCartPending = () => ({
    type: GET_CART_PENDING,
});

const getCartFulfilled = (cart) => ({
    type: GET_CART_FULFILLED,
    payload: cart,
});

const getCartRejected = (error) => ({
    type: GET_CART_REJECTED,
    error: error,
});

const addToCartPending = () => ({
    type: ADD_TO_CART_PENDING,
});

const addToCartFulfilled = (cart) => ({
    type: ADD_TO_CART_FULFILLED,
});

const addToCartRejected = (error) => ({
    type: ADD_TO_CART_REJECTED,
    error: error,
});

const clearCartPending = () => ({
    type: CLEAR_CART_PENDING,
});

const clearCartFulfilled = () => ({
    type: CLEAR_CART_FULFILLED,
});

const clearCartRejected = (error) => ({
    type: CLEAR_CART_REJECTED,
    error: error,
});

const updateCartPending = () => ({
    type: UPDATE_CART_PENDING,
});

const updateCartFulfilled = () => ({
    type: UPDATE_CART_FULFILLED,
});

const updateCartRejected = (error) => ({
    type: UPDATE_CART_REJECTED,
    error: error,
});

const removeFromCartPending = () => ({
    type: REMOVE_FROM_CART_PENDING,
});

const removeFromCartFulfilled = (cart) => ({
    type: REMOVE_FROM_CART_FULFILLED,
});

const removeFromCartRejected = (error) => ({
    type: REMOVE_FROM_CART_REJECTED,
    error: error,
});

export const getCart = () => async (dispatch) => {
    dispatch(getCartPending());
    try {
        const response = await axios.get('/api/cart');
        dispatch(getCartFulfilled(response.data));
    } catch (error) {
        dispatch(getCartRejected(error.response.data.error));
        console.log('Error while fetching cart data:', error);
        toast.error('Error while fetching cart data');
    }
};

export const addToCart = (productId, size, quantity) => async (dispatch) => {
    dispatch(addToCartPending());
    try {
        const response = await axios.post('/api/cart', { productId, size, quantity });
        dispatch(addToCartFulfilled());
        dispatch(getCart());
        toast.success('Item added to cart');
    } catch (error) {
        dispatch(addToCartRejected(error.response.data.error));
        console.log('Error while adding item to cart:', error);
        toast.error('Error while adding item to cart');
    }
};

export const clearCart = () => async (dispatch) => {
    dispatch(clearCartPending());
    try {
        const response = await axios.delete('/api/cart');
        dispatch(clearCartFulfilled());
        dispatch(getCart());
    } catch (error) {
        dispatch(clearCartRejected(error.response.data.error));
        console.log('Error while clearing cart:', error);
        toast.error('Error while clearing cart');
    }
};

export const updateCart = (cartItemId, updatedFields) => async (dispatch) => {
    dispatch(updateCartPending());
    try {
        const response = await axios.patch(`/api/cart/item/${cartItemId}`, updatedFields);
        dispatch(updateCartFulfilled());
        dispatch(getCart());
    } catch (error) {
        dispatch(updateCartRejected(null));
        console.log('Error while updating cart:', error);
        toast.error(error.response.data.error || 'Error while updating cart');
    }
};

export const removeFromCart = (cartItemId) => async (dispatch) => {
    dispatch(removeFromCartPending());
    try {
        const response = await axios.delete(`/api/cart/item/${cartItemId}`);
        dispatch(removeFromCartFulfilled());
        dispatch(getCart());
    } catch (error) {
        dispatch(removeFromCartRejected(error.response.data.error));
        console.log('Error while removing item from cart:', error);
        toast.error('Error while removing item from cart');
    }
};