import { toast } from 'react-hot-toast';
import axios from '../../../utils/axiosConfig';
import {
    GET_PRODUCT_FILTERS_PENDING,
    GET_PRODUCT_FILTERS_FULFILLED,
    GET_PRODUCT_FILTERS_REJECTED,
} from './type';

const getFiltersPending = () => ({
    type: GET_PRODUCT_FILTERS_PENDING,
});

const getFiltersFulfilled = (filters) => ({
    type: GET_PRODUCT_FILTERS_FULFILLED,
    payload: filters,
});

const getFiltersRejected = (error) => ({
    type: GET_PRODUCT_FILTERS_REJECTED,
    error: error,
});

export const getFilters = (query) => async (dispatch) => {
    dispatch(getFiltersPending());
    try {
        const response = await axios.get(`/api/products/filters?query=${query}`);
        dispatch(getFiltersFulfilled(response.data));
    } catch (error) {
        dispatch(getFiltersRejected(error));
        console.log('Failed to fetch filters', error);
        toast.error('Failed to fetch filters');
    }
};