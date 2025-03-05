import axios from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import {
    GET_PRODUCTS_PENDING,
    GET_PRODUCTS_FULFILLED,
    GET_PRODUCTS_REJECTED,
} from './searchTypes';

const getProductsPending = () => ({
    type: GET_PRODUCTS_PENDING,
});

const getProductsFulfilled = (products, filters) => ({
    type: GET_PRODUCTS_FULFILLED,
    products: products,
    filters: filters,
});

const getProductsRejected = (error) => ({
    type: GET_PRODUCTS_REJECTED,
    error: error,
});

export const getProducts = (query, pageNumber, pageSize) => async (dispatch) => {
    dispatch(getProductsPending());
    try {
        const response = await axios.get(`/api/search?query=${query}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
        dispatch(getProductsFulfilled(response.data, null));
    } catch (error) {
        dispatch(getProductsRejected(error));
        console.log('Failed to fetch products', error);
        toast.error('Failed to fetch products');
    }
};