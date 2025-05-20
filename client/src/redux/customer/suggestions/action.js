import { toast } from 'react-hot-toast';
import axios from '../../../utils/axiosConfig';
import {
    GET_SEARCH_SUGGESTIONS_PENDING,
    GET_SEARCH_SUGGESTIONS_FULFILLED,
    GET_SEARCH_SUGGESTIONS_REJECTED,
    GET_SEARCH_HISTORY_PENDING,
    GET_SEARCH_HISTORY_FULFILLED,
    GET_SEARCH_HISTORY_REJECTED,
    GET_AUTOCOMPLETE_PENDING,
    GET_AUTOCOMPLETE_FULFILLED,
    GET_AUTOCOMPLETE_REJECTED,
    ADD_SEARCH_SUGGESTIONS_PENDING,
    ADD_SEARCH_SUGGESTIONS_FULFILLED,
    ADD_SEARCH_SUGGESTIONS_REJECTED,
    REMOVE_SEARCH_SUGGESTIONS_PENDING,
    REMOVE_SEARCH_SUGGESTIONS_FULFILLED,
    REMOVE_SEARCH_SUGGESTIONS_REJECTED,
    CLEAR_SEARCH_SUGGESTIONS_PENDING,
    CLEAR_SEARCH_SUGGESTIONS_FULFILLED,
    CLEAR_SEARCH_SUGGESTIONS_REJECTED,
} from './type';

const getSearchSuggestionsPending = () => ({
    type: GET_SEARCH_SUGGESTIONS_PENDING,
});

const getSearchSuggestionsFulfilled = (suggestions) => ({
    type: GET_SEARCH_SUGGESTIONS_FULFILLED,
    payload: suggestions,
});

const getSearchSuggestionsRejected = (error) => ({
    type: GET_SEARCH_SUGGESTIONS_REJECTED,
    error: error,
});

const getSearchHistoryPending = () => ({
    type: GET_SEARCH_HISTORY_PENDING,
});

const getSearchHistoryFulfilled = (history) => ({
    type: GET_SEARCH_HISTORY_FULFILLED,
    payload: history,
});

const getSearchHistoryRejected = (error) => ({
    type: GET_SEARCH_HISTORY_REJECTED,
    error: error,
});

const getAutocompletePending = () => ({
    type: GET_AUTOCOMPLETE_PENDING,
});

const getAutocompleteFulfilled = (autocomplete) => ({
    type: GET_AUTOCOMPLETE_FULFILLED,
    payload: autocomplete,
});

const getAutocompleteRejected = (error) => ({
    type: GET_AUTOCOMPLETE_REJECTED,
    error: error,
});

const addSearchSuggestionsPending = () => ({
    type: ADD_SEARCH_SUGGESTIONS_PENDING,
});

const addSearchSuggestionsFulfilled = () => ({
    type: ADD_SEARCH_SUGGESTIONS_FULFILLED,
});

const addSearchSuggestionsRejected = (error) => ({
    type: ADD_SEARCH_SUGGESTIONS_REJECTED,
    error: error,
});

const removeSearchSuggestionsPending = () => ({
    type: REMOVE_SEARCH_SUGGESTIONS_PENDING,
});

const removeSearchSuggestionsFulfilled = () => ({
    type: REMOVE_SEARCH_SUGGESTIONS_FULFILLED,
});

const removeSearchSuggestionsRejected = (error) => ({
    type: REMOVE_SEARCH_SUGGESTIONS_REJECTED,
    error: error,
});

const clearSearchSuggestionsPending = () => ({
    type: CLEAR_SEARCH_SUGGESTIONS_PENDING,
});

const clearSearchSuggestionsFulfilled = () => ({
    type: CLEAR_SEARCH_SUGGESTIONS_FULFILLED,
});

const clearSearchSuggestionsRejected = (error) => ({
    type: CLEAR_SEARCH_SUGGESTIONS_REJECTED,
    error: error,
});

export const getSearchSuggestions = (query) => async (dispatch) => {
    dispatch(getSearchSuggestionsPending());
    try {
        const response = await axios.get(`/api/user/search?query=${query}`);
        dispatch(getSearchSuggestionsFulfilled(response.data.data));
    } catch (error) {
        dispatch(getSearchSuggestionsRejected(error));
        console.error('Failed to fetch search suggestions', error.response.data.error);
        toast.error('Failed to fetch search suggestions');
    }
};

export const getSearchHistory = () => async (dispatch) => {
    dispatch(getSearchHistoryPending());
    try {
        const response = await axios.get('/api/user/search/history');
        dispatch(getSearchHistoryFulfilled(response.data.data));
    } catch (error) {
        dispatch(getSearchHistoryRejected(error));
        console.error('Failed to fetch search history', error.response.data.error);
        toast.error('Failed to fetch search history');
    }
};

export const getAutocomplete = (query) => async (dispatch) => {
    dispatch(getAutocompletePending());
    try {
        const response = await axios.get(`/api/user/search/autocomplete?query=${query}`);
        dispatch(getAutocompleteFulfilled(response.data.data));
    } catch (error) {
        dispatch(getAutocompleteRejected(error));
        console.error('Failed to fetch autocomplete suggestions', error.response.data.error);
        toast.error('Failed to fetch autocomplete suggestions');
    }
};

export const saveSearchHistory = (phrase) => async (dispatch) => {
    dispatch(addSearchSuggestionsPending());
    try {
        const response = await axios.post(`/api/user/search?phrase=${phrase}`);
        dispatch(addSearchSuggestionsFulfilled());
    } catch (error) {
        dispatch(addSearchSuggestionsRejected(error));
        console.error('Failed to add search suggestion', error.response.data.error);
        toast.error('Failed to add search suggestion');
    }
};

export const removeSearchHistory = (phraseId) => async (dispatch) => {
    dispatch(removeSearchSuggestionsPending());
    try {
        const response = await axios.delete(`/api/user/search?phraseId=${phraseId}`);
        dispatch(removeSearchSuggestionsFulfilled());
    } catch (error) {
        dispatch(removeSearchSuggestionsRejected(error));
        console.error('Failed to remove search suggestion', error.response.data.error);
        toast.error('Failed to remove search suggestion');
    }
};

export const clearSearchHistory = () => async (dispatch) => {
    dispatch(clearSearchSuggestionsPending());
    try {
        const response = await axios.delete('/api/user/search/clear');
        dispatch(clearSearchSuggestionsFulfilled());
    } catch (error) {
        dispatch(clearSearchSuggestionsRejected(error));
        console.log('Failed to clear search suggestions', error.response.data.error);
        toast.error('Failed to clear search suggestions');
    }
};