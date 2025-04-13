import axios from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import {
    GET_SEARCHED_PRODUCTS_PENDING,
    GET_SEARCHED_PRODUCTS_FULFILLED,
    GET_SEARCHED_PRODUCTS_REJECTED,
} from './type';

const getProductsPending = () => ({
    type: GET_SEARCHED_PRODUCTS_PENDING,
});

const getProductsFulfilled = (searchProducts) => ({
    type: GET_SEARCHED_PRODUCTS_FULFILLED,
    payload: searchProducts,
});

const getProductsRejected = (error) => ({
    type: GET_SEARCHED_PRODUCTS_REJECTED,
    error: error,
});

export const getProducts = (query, minPrice, maxPrice, filters, sort, pageNumber, pageSize) => async (dispatch) => {
    dispatch(getProductsPending());
    try {
        // Convert filters object into query params
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (sort && sort !== 'default') params.append('sort', sort);
        if (pageNumber) params.append('pageNumber', pageNumber);
        if (pageSize) params.append('pageSize', pageSize);

        // Loop through filters and append multiple values
        Object.keys(filters).forEach((key) => {
            filters[key].forEach((value) => {
                params.append(key, value);
            });
        });

        const response = await axios.get(`/api/search?${params.toString()}`);
        dispatch(getProductsFulfilled(response.data));
        console.log("URL fired: ", response.config.url);

    } catch (error) {
        dispatch(getProductsRejected(error));
        console.log('Failed to fetch products', error);
        toast.error('Failed to fetch products');
    }
};