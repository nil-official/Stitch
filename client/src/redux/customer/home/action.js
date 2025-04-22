import { toast } from 'react-hot-toast';
import axios from '../../../utils/axiosConfig';
import {
    GET_HOME_PRODUCTS_PENDING,
    GET_HOME_PRODUCTS_FULFILLED,
    GET_HOME_PRODUCTS_REJECTED,
} from './type';

const getHomeProductsPending = () => ({
    type: GET_HOME_PRODUCTS_PENDING,
});

const getHomeProductsFulfilled = (data) => ({
    type: GET_HOME_PRODUCTS_FULFILLED,
    payload: data,
});

const getHomeProductsRejected = (error) => ({
    type: GET_HOME_PRODUCTS_REJECTED,
    payload: error,
});

export const getHomeProducts = (pageNumber, pageSize) => async (dispatch) => {
    dispatch(getHomeProductsPending());
    try {
        const response = await axios.get(`/public/home/products?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        dispatch(getHomeProductsFulfilled(response.data));
    } catch (error) {
        dispatch(getHomeProductsRejected(error));
        console.error('Error fetching home products:', error);
        toast.error(error?.response?.data?.message || 'Failed to load home products!');
    }
};