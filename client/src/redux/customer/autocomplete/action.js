import axios from '../../../utils/axiosConfig';
import {
    GET_AUTOCOMPLETE_PENDING,
    GET_AUTOCOMPLETE_FULFILLED,
    GET_AUTOCOMPLETE_REJECTED,
} from './type';

export const getAutocomplete = (query) => async (dispatch) => {
    dispatch({ type: GET_AUTOCOMPLETE_PENDING });
    try {
        const res = await axios.get(`/api/products/autocomplete?q=${query}`);
        dispatch({ type: GET_AUTOCOMPLETE_FULFILLED, items: res.data.data });
        return res.data.data;
    } catch (error) {
        dispatch({ type: GET_AUTOCOMPLETE_REJECTED, error: error.response?.data?.error || "Autocomplete fetch failed." });
        console.error('Failed to fetch autocomplete ', error.response.data.error);
        return null;
    }
};