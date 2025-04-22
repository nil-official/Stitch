import { toast } from 'react-hot-toast';
import axios from "../../../utils/axiosConfig";
import { logout } from "../../auth/action";
import {
    GET_PROFILE_PENDING,
    GET_PROFILE_FULFILLED,
    GET_PROFILE_REJECTED,
    UPDATE_PROFILE_PENDING,
    UPDATE_PROFILE_FULFILLED,
    UPDATE_PROFILE_REJECTED,
    DELETE_PROFILE_PENDING,
    DELETE_PROFILE_FULFILLED,
    DELETE_PROFILE_REJECTED,
} from './type';

const getProfilePending = () => ({
    type: GET_PROFILE_PENDING,
});

const getProfileFulfilled = (profile) => ({
    type: GET_PROFILE_FULFILLED,
    payload: profile,
});

const getProfileRejected = (error) => ({
    type: GET_PROFILE_REJECTED,
    error: error,
});

const updateProfilePending = () => ({
    type: UPDATE_PROFILE_PENDING,
});

const updateProfileFulfilled = () => ({
    type: UPDATE_PROFILE_FULFILLED,
});

const updateProfileRejected = (error) => ({
    type: UPDATE_PROFILE_REJECTED,
    error: error,
});

const deleteProfilePending = () => ({
    type: DELETE_PROFILE_PENDING,
});

const deleteProfileFulfilled = () => ({
    type: DELETE_PROFILE_FULFILLED,
});

const deleteProfileRejected = (error) => ({
    type: DELETE_PROFILE_REJECTED,
    error: error,
});

export const getProfile = () => async (dispatch) => {
    dispatch(getProfilePending());
    try {
        const response = await axios.get("/api/user");
        dispatch(getProfileFulfilled(response.data));
    } catch (error) {
        dispatch(getProfileRejected(error.response.data.error));
        console.log("Failed to fetch profile data", error);
        toast.error("Failed to fetch profile data.");
    }
};

export const updateProfile = (data) => async (dispatch) => {
    dispatch(updateProfilePending());
    try {
        const response = await axios.patch("/api/user", data);
        dispatch(updateProfileFulfilled());
        dispatch(getProfile());
        toast.success("Profile updated successfully.");
    } catch (error) {
        dispatch(updateProfileRejected(error.response.data.error));
        console.log("Failed to update profile", error);
        toast.error("Failed to update profile.");
    }
};

export const deleteProfile = () => async (dispatch) => {
    dispatch(deleteProfilePending());
    try {
        const response = await axios.delete("/api/user");
        dispatch(deleteProfileFulfilled());
        dispatch(logout());
        toast.success(response.data.message);

    } catch (error) {
        dispatch(deleteProfileRejected(error.response.data.error));
        console.log("Failed to delete profile", error);
        toast.error("Failed to delete profile.");
    }
};