import { toast } from "react-toastify";
import axios from "../../../utils/axiosConfig";
import {
    GET_ADDRESS_PENDING,
    GET_ADDRESS_FULFILLED,
    GET_ADDRESS_REJECTED,
    ADD_ADDRESS_PENDING,
    ADD_ADDRESS_FULFILLED,
    ADD_ADDRESS_REJECTED,
    UPDATE_ADDRESS_PENDING,
    UPDATE_ADDRESS_FULFILLED,
    UPDATE_ADDRESS_REJECTED,
    DELETE_ADDRESS_PENDING,
    DELETE_ADDRESS_FULFILLED,
    DELETE_ADDRESS_REJECTED,
} from './type';

const getAddressPending = () => ({
    type: GET_ADDRESS_PENDING,
});

const getAddressFulfilled = (address) => ({
    type: GET_ADDRESS_FULFILLED,
    payload: address,
});

const getAddressRejected = (error) => ({
    type: GET_ADDRESS_REJECTED,
    error: error,
});

const addAddressPending = () => ({
    type: ADD_ADDRESS_PENDING,
});

const addAddressFulfilled = () => ({
    type: ADD_ADDRESS_FULFILLED,
});

const addAddressRejected = (error) => ({
    type: ADD_ADDRESS_REJECTED,
    error: error,
});

const updateAddressPending = () => ({
    type: UPDATE_ADDRESS_PENDING,
});

const updateAddressFulfilled = () => ({
    type: UPDATE_ADDRESS_FULFILLED,
});

const updateAddressRejected = (error) => ({
    type: UPDATE_ADDRESS_REJECTED,
    error: error,
});

const deleteAddressPending = () => ({
    type: DELETE_ADDRESS_PENDING,
});

const deleteAddressFulfilled = () => ({
    type: DELETE_ADDRESS_FULFILLED,
});

const deleteAddressRejected = (error) => ({
    type: DELETE_ADDRESS_REJECTED,
    error: error,
});

export const getAddress = () => async (dispatch) => {
    dispatch(getAddressPending());
    try {
        const response = await axios.get("/api/user/address");
        dispatch(getAddressFulfilled(response.data));
    } catch (error) {
        dispatch(getAddressRejected(error.response.data.error));
        console.log("Failed to fetch address data", error);
        toast.error("Failed to fetch address data.");
    }
};

export const addAddress = (address) => async (dispatch) => {
    dispatch(addAddressPending());
    try {
        await axios.post("/api/user/address", address);
        dispatch(addAddressFulfilled());
        dispatch(getAddress());
    } catch (error) {
        dispatch(addAddressRejected(error.response.data.error));
        console.log("Failed to add address", error);
        toast.error("Failed to add address.");
    }
};

export const updateAddress = (addressId, address) => async (dispatch) => {
    dispatch(updateAddressPending());
    try {
        await axios.patch(`/api/user/address/${addressId}`, address);
        dispatch(updateAddressFulfilled());
        dispatch(getAddress());
        toast.success("Address updated successfully!");
    } catch (error) {
        dispatch(updateAddressRejected(error.response.data.error));
        console.log("Failed to update address", error);
        toast.error("Failed to update address.");
    }
};

export const deleteAddress = (addressId) => async (dispatch) => {
    dispatch(deleteAddressPending());
    try {
        await axios.delete(`/api/user/address/${addressId}`);
        dispatch(deleteAddressFulfilled());
        dispatch(getAddress());
        toast.success("Address deleted successfully!");
    } catch (error) {
        dispatch(deleteAddressRejected(error.response.data.error));
        console.log("Failed to delete address", error);
        toast.error("Failed to delete address.");
    }
};