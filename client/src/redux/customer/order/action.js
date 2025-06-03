import { toast } from 'react-hot-toast';
import axios from "../../../utils/axiosConfig";
import {
    SET_ORDER_DATA,
    CREATE_ORDER_PENDING,
    CREATE_ORDER_FULFILLED,
    CREATE_ORDER_REJECTED,
    GET_ORDER_PENDING,
    GET_ORDER_FULFILLED,
    GET_ORDER_REJECTED,
    GET_USER_ORDERS_PENDING,
    GET_USER_ORDERS_FULFILLED,
    GET_USER_ORDERS_REJECTED,
    PROCESS_PAYMENT_PENDING,
    PROCESS_PAYMENT_FULFILLED,
    PROCESS_PAYMENT_REJECTED,
    VERIFY_PAYMENT_PENDING,
    VERIFY_PAYMENT_FULFILLED,
    VERIFY_PAYMENT_REJECTED,
    CANCEL_ORDER_PENDING,
    CANCEL_ORDER_FULFILLED,
    CANCEL_ORDER_REJECTED,
} from './type';

// Order Creation Action Creators
const createOrderPending = () => ({
    type: CREATE_ORDER_PENDING
});

const createOrderFulfilled = (orderData) => ({
    type: CREATE_ORDER_FULFILLED,
    payload: orderData
});

const createOrderRejected = (error) => ({
    type: CREATE_ORDER_REJECTED,
    error: error
});

// Get Single Order Action Creators
const getOrderPending = () => ({
    type: GET_ORDER_PENDING
});

const getOrderFulfilled = (orderData) => ({
    type: GET_ORDER_FULFILLED,
    payload: orderData
});

const getOrderRejected = (error) => ({
    type: GET_ORDER_REJECTED,
    error: error
});

// Get User Orders Action Creators
const getUserOrdersPending = () => ({
    type: GET_USER_ORDERS_PENDING
});

const getUserOrdersFulfilled = (orders) => ({
    type: GET_USER_ORDERS_FULFILLED,
    payload: orders
});

const getUserOrdersRejected = (error) => ({
    type: GET_USER_ORDERS_REJECTED,
    error: error
});

// Payment Processing Action Creators
const processPaymentPending = () => ({
    type: PROCESS_PAYMENT_PENDING
});

const processPaymentFulfilled = (paymentData) => ({
    type: PROCESS_PAYMENT_FULFILLED,
    payload: paymentData
});

const processPaymentRejected = (error) => ({
    type: PROCESS_PAYMENT_REJECTED,
    error: error
});

// Payment Verification Action Creators
const verifyPaymentPending = () => ({
    type: VERIFY_PAYMENT_PENDING
});

const verifyPaymentFulfilled = (verificationData) => ({
    type: VERIFY_PAYMENT_FULFILLED,
    payload: verificationData
});

const verifyPaymentRejected = (error) => ({
    type: VERIFY_PAYMENT_REJECTED,
    error: error
});

// Cancel Order Action Creators
const cancelOrderPending = () => ({
    type: CANCEL_ORDER_PENDING
});

const cancelOrderFulfilled = (orderId) => ({
    type: CANCEL_ORDER_FULFILLED,
    payload: orderId
});

const cancelOrderRejected = (error) => ({
    type: CANCEL_ORDER_REJECTED,
    error: error
});

export const setOrderData = (orderData) => ({
    type: SET_ORDER_DATA,
    payload: orderData
});

export const createOrder = (orderData) => async (dispatch) => {
    dispatch(createOrderPending());
    try {
        const response = await axios.post("/api/orders", orderData);
        dispatch(createOrderFulfilled(response.data));
        return response.data; // Return data for use in component
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to create order";
        dispatch(createOrderRejected(errorMessage));
        toast.error(errorMessage);
        throw error;
    }
};

export const getOrder = (orderId) => async (dispatch) => {
    dispatch(getOrderPending());
    try {
        const response = await axios.get(`/api/orders/${orderId}`);
        dispatch(getOrderFulfilled(response.data));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch order details";
        dispatch(getOrderRejected(errorMessage));
        toast.error(errorMessage);
        throw error;
    }
};

export const getOrderByOrderId = (orderIdString) => async (dispatch) => {
    dispatch(getOrderPending());
    try {
        const response = await axios.get(`/api/orders/by-order-id/${orderIdString}`);
        dispatch(getOrderFulfilled(response.data));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch order details";
        dispatch(getOrderRejected(errorMessage));
        toast.error(errorMessage);
        throw error;
    }
};

export const getUserOrders = () => async (dispatch) => {
    dispatch(getUserOrdersPending());
    try {
        const response = await axios.get("/api/orders/user");
        dispatch(getUserOrdersFulfilled(response.data));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch your orders";
        dispatch(getUserOrdersRejected(errorMessage));
        toast.error(errorMessage);
        throw error;
    }
};

export const verifyPayment = (paymentData) => async (dispatch) => {
    dispatch(verifyPaymentPending());
    try {
        const response = await axios.post("/api/payments/verify", paymentData);
        dispatch(verifyPaymentFulfilled(response.data));
        toast.success("Payment verified successfully!");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Payment verification failed";
        dispatch(verifyPaymentRejected(errorMessage));
        toast.error(errorMessage);
        throw error;
    }
};

export const cancelOrder = (orderId) => async (dispatch) => {
    dispatch(cancelOrderPending());
    try {
        const response = await axios.put(`/api/orders/${orderId}/cancel`);
        dispatch(cancelOrderFulfilled(orderId));
        toast.info("Order has been cancelled");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to cancel order";
        dispatch(cancelOrderRejected(errorMessage));
        toast.error(errorMessage);
        throw error;
    }
};

export const handlePaymentFailure = (orderId) => async (dispatch) => {
    try {
        await axios.post("/api/payments/failed", { orderId });
        toast.error("Payment failed. Please try again.");
    } catch (error) {
        console.error("Error handling payment failure:", error);
    }
};