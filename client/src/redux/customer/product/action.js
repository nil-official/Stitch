import { toast } from "react-toastify";
import axios from "../../../utils/axiosConfig";
import {
    GET_PRODUCT_PENDING,
    GET_PRODUCT_FULFILLED,
    GET_PRODUCT_REJECTED,
    GET_SIMILAR_PRODUCTS_PENDING,
    GET_SIMILAR_PRODUCTS_FULFILLED,
    GET_SIMILAR_PRODUCTS_REJECTED,
    GET_LIKE_PRODUCTS_PENDING,
    GET_LIKE_PRODUCTS_FULFILLED,
    GET_LIKE_PRODUCTS_REJECTED,
    UPDATE_PRODUCT_PENDING,
    UPDATE_PRODUCT_FULFILLED,
    UPDATE_PRODUCT_REJECTED,
    DELETE_PRODUCT_PENDING,
    DELETE_PRODUCT_FULFILLED,
    DELETE_PRODUCT_REJECTED,
} from "./type";

const getProductPending = () => ({
    type: GET_PRODUCT_PENDING,
});

const getProductFulfilled = (product) => ({
    type: GET_PRODUCT_FULFILLED,
    payload: product,
});

const getProductRejected = (error) => ({
    type: GET_PRODUCT_REJECTED,
    error: error,
});

const getSimilarProductsPending = () => ({
    type: GET_SIMILAR_PRODUCTS_PENDING,
});

const getSimilarProductsFulfilled = (products) => ({
    type: GET_SIMILAR_PRODUCTS_FULFILLED,
    payload: products,
});

const getSimilarProductsRejected = (error) => ({
    type: GET_SIMILAR_PRODUCTS_REJECTED,
    error: error,
});

const getLikeProductsPending = () => ({
    type: GET_LIKE_PRODUCTS_PENDING,
});

const getLikeProductsFulfilled = (products) => ({
    type: GET_LIKE_PRODUCTS_FULFILLED,
    payload: products,
});

const getLikeProductsRejected = (error) => ({
    type: GET_LIKE_PRODUCTS_REJECTED,
    error: error,
});

const updateProductPending = () => ({
    type: UPDATE_PRODUCT_PENDING,
});

const updateProductFulfilled = (product) => ({
    type: UPDATE_PRODUCT_FULFILLED,
    payload: product,
});

const updateProductRejected = (error) => ({
    type: UPDATE_PRODUCT_REJECTED,
    error: error,
});

const deleteProductPending = () => ({
    type: DELETE_PRODUCT_PENDING,
});

const deleteProductFulfilled = (product) => ({
    type: DELETE_PRODUCT_FULFILLED,
    payload: product,
});

const deleteProductRejected = (error) => ({
    type: DELETE_PRODUCT_REJECTED,
    error: error,
});

export const getProduct = (id) => async (dispatch) => {
    dispatch(getProductPending());
    try {
        const response = await axios.get(`/api/products/id/${id}`);
        dispatch(getProductFulfilled(response.data));
    } catch (error) {
        dispatch(getProductRejected(error.response.data.error));
        console.log("Failed to fetch product", error);
        toast.error("Failed to fetch product");
    }
};

export const getSimilarProducts = (productId, page, pageSize) => async (dispatch) => {
    dispatch(getSimilarProductsPending());
    try {
        const response = await axios.get(`/api/products/similar/${productId}?pageNumber=${page}&pageSize=${pageSize}`);
        dispatch(getSimilarProductsFulfilled(response.data.content));
    } catch (error) {
        dispatch(getSimilarProductsRejected(error.response.data.error));
        console.log("Failed to fetch similar products", error);
        toast.error("Failed to fetch similar products");
    }
};

export const getLikeProducts = (productId, page, pageSize) => async (dispatch) => {
    dispatch(getLikeProductsPending());
    try {
        const response = await axios.get(`/api/products/like/${productId}?pageNumber=${page}&pageSize=${pageSize}`);
        dispatch(getLikeProductsFulfilled(response.data.content));
    } catch (error) {
        dispatch(getLikeProductsRejected(error.response.data.error));
        console.log("Failed to fetch like products", error);
        toast.error("Failed to fetch like products");
    }
};

export const updateProduct = (id, productData) => async (dispatch) => {
    dispatch(updateProductPending());
    try {
        const response = await axios.put(`/api/products/id/${id}`, productData);
        dispatch(updateProductFulfilled(response.data));
        toast.success("Product updated successfully");
    } catch (error) {
        dispatch(updateProductRejected(error));
        console.log("Failed to update product", error);
        toast.error("Failed to update product");
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    dispatch(deleteProductPending());
    try {
        const response = await axios.delete(`/api/products/id/${id}`);
        dispatch(deleteProductFulfilled(response.data));
        toast.success("Product deleted successfully");
    } catch (error) {
        dispatch(deleteProductRejected(error));
        console.log("Failed to delete product", error);
        toast.error("Failed to delete product");
    }
};