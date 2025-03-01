import axios from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import {
    GET_CART_PENDING,
    GET_CART_FULFILLED,
    GET_CART_REJECTED,
    ADD_TO_CART_PENDING,
    ADD_TO_CART_FULFILLED,
    ADD_TO_CART_REJECTED,
    UPDATE_CART_PENDING,
    UPDATE_CART_FULFILLED,
    UPDATE_CART_REJECTED,
    REMOVE_FROM_CART_PENDING,
    REMOVE_FROM_CART_FULFILLED,
    REMOVE_FROM_CART_REJECTED,
} from './cartTypes';

const getCartPending = () => ({
    type: GET_CART_PENDING,
});

const getCartFulfilled = (cart) => ({
    type: GET_CART_FULFILLED,
    payload: cart,
});

const getCartRejected = (error) => ({
    type: GET_CART_REJECTED,
    payload: error,
});

const addToCartPending = () => ({
    type: ADD_TO_CART_PENDING,
});

const addToCartFulfilled = (cart) => ({
    type: ADD_TO_CART_FULFILLED,
    payload: cart,
});

const addToCartRejected = (error) => ({
    type: ADD_TO_CART_REJECTED,
    payload: error,
});

const updateCartPending = () => ({
    type: UPDATE_CART_PENDING,
});

const updateCartFulfilled = (cart) => ({
    type: UPDATE_CART_FULFILLED,
    payload: cart,
});

const updateCartRejected = (error) => ({
    type: UPDATE_CART_REJECTED,
    payload: error,
});

const removeFromCartPending = () => ({
    type: REMOVE_FROM_CART_PENDING,
});

const removeFromCartFulfilled = (cart) => ({
    type: REMOVE_FROM_CART_FULFILLED,
    payload: cart,
});

const removeFromCartRejected = (error) => ({
    type: REMOVE_FROM_CART_REJECTED,
    payload: error,
});

export const getCart = () => async (dispatch) => {
    dispatch(getCartPending());
    try {
        const res = await axios.get('/api/cart/');
        // setTimeout(() => {
        dispatch(getCartFulfilled(res.data));
        // }, 5000);
    } catch (error) {
        dispatch(getCartRejected(error));
        console.log(error);
        toast.error('Error while fetching cart');
    }
};

export const addToCart = (productId, size, quantity) => async (dispatch) => {
    dispatch(addToCartPending());
    try {
        const res = await axios.post('/api/cart/add', { productId, size, quantity });
        dispatch(addToCartFulfilled(res.data));
        dispatch(getCart());
        toast.success('Item added to cart');
    } catch (error) {
        dispatch(addToCartRejected(error));
        console.log(error);
        toast.error('Error while adding item to cart');
    }
};

export const updateCart = (productId, quantity) => async (dispatch) => {
    dispatch(updateCartPending());
    try {
        const res = await axios.put(`/api/cart_items/${productId}`, { quantity });
        dispatch(updateCartFulfilled(res.data));
        dispatch(getCart());
    } catch (error) {
        dispatch(updateCartRejected(error));
        console.log(error);
        toast.error('Error while updating cart');
    }
};

export const removeFromCart = (productId) => async (dispatch) => {
    dispatch(removeFromCartPending());
    try {
        const res = await axios.delete(`/api/cart_items/${productId}`);
        dispatch(removeFromCartFulfilled(res.data));
        dispatch(getCart());
    } catch (error) {
        dispatch(removeFromCartRejected(error));
        console.log(error);
        toast.error('Error while removing item from cart');
    }
};