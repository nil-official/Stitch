import axios from '../../../utils/axiosConfig';
import {
    GET_HISTORY_PENDING,
    GET_HISTORY_FULFILLED,
    GET_HISTORY_REJECTED,
    SAVE_HISTORY_PENDING,
    SAVE_HISTORY_FULFILLED,
    SAVE_HISTORY_REJECTED,
    DELETE_HISTORY_PENDING,
    DELETE_HISTORY_FULFILLED,
    DELETE_HISTORY_REJECTED,
} from './type';

export const getHistory = () => async (dispatch) => {
    dispatch({ type: GET_HISTORY_PENDING });
    try {
        const res = await axios.get('/api/user/search/history');
        dispatch({ type: GET_HISTORY_FULFILLED, items: res.data.data });
    } catch (error) {
        dispatch({ type: GET_HISTORY_REJECTED, error: error.response?.data?.error || "History fetch failed." });
        console.error('Failed to fetch history ', error.response.data.error);
    }
};

export const saveHistory = (phrase) => async (dispatch) => {
    dispatch({ type: SAVE_HISTORY_PENDING });
    try {
        await axios.post(`/api/user/search?phrase=${phrase}`);
        dispatch({ type: SAVE_HISTORY_FULFILLED });
        dispatch(getHistory());
    } catch (error) {
        dispatch({ type: SAVE_HISTORY_REJECTED, error: error.response?.data?.error || "History save failed." });
        console.error('Failed to save history ', error.response.data.error);
    }
};

export const deleteHistory = (phraseId) => async (dispatch) => {
    dispatch({ type: DELETE_HISTORY_PENDING });
    try {
        await axios.delete(`/api/user/search?phraseId=${phraseId}`);
        dispatch({ type: DELETE_HISTORY_FULFILLED });
        dispatch(getHistory());
    } catch (error) {
        dispatch({ type: DELETE_HISTORY_REJECTED, error: error.response?.data?.error || "History delete failed." });
        console.error('Failed to delete history ', error.response.data.error);
    }
};