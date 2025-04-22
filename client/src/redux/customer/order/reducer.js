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

const initialState = {
    currentOrder: null,
    orders: [],
    orderData: null,
    loading: false,
    paymentLoading: false,
    paymentSuccess: false,
    paymentError: null,
    error: null,
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        // Create Order
        case CREATE_ORDER_PENDING:
            return {
                ...state,
                loading: true,
                error: null
            };
        case CREATE_ORDER_FULFILLED:
            return {
                ...state,
                loading: false,
                currentOrder: action.payload,
                error: null
            };
        case CREATE_ORDER_REJECTED:
            return {
                ...state,
                loading: false,
                error: action.error
            };

        // Get Single Order
        case GET_ORDER_PENDING:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_ORDER_FULFILLED:
            return {
                ...state,
                loading: false,
                currentOrder: action.payload,
                error: null
            };
        case GET_ORDER_REJECTED:
            return {
                ...state,
                loading: false,
                error: action.error
            };

        // Get User Orders
        case GET_USER_ORDERS_PENDING:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_USER_ORDERS_FULFILLED:
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: null
            };
        case GET_USER_ORDERS_REJECTED:
            return {
                ...state,
                loading: false,
                error: action.error
            };

        // Process Payment
        case PROCESS_PAYMENT_PENDING:
            return {
                ...state,
                paymentLoading: true,
                paymentSuccess: false,
                paymentError: null
            };
        case PROCESS_PAYMENT_FULFILLED:
            return {
                ...state,
                paymentLoading: false,
                paymentSuccess: true,
                paymentError: null
            };
        case PROCESS_PAYMENT_REJECTED:
            return {
                ...state,
                paymentLoading: false,
                paymentSuccess: false,
                paymentError: action.error
            };

        // Verify Payment
        case VERIFY_PAYMENT_PENDING:
            return {
                ...state,
                paymentLoading: true,
                paymentError: null
            };
        case VERIFY_PAYMENT_FULFILLED:
            return {
                ...state,
                paymentLoading: false,
                paymentSuccess: true,
                paymentError: null
            };
        case VERIFY_PAYMENT_REJECTED:
            return {
                ...state,
                paymentLoading: false,
                paymentSuccess: false,
                paymentError: action.error
            };

        // Cancel Order
        case CANCEL_ORDER_PENDING:
            return {
                ...state,
                loading: true,
                error: null
            };
        case CANCEL_ORDER_FULFILLED:
            return {
                ...state,
                loading: false,
                orders: state.orders.map(order =>
                    order.id === action.payload ? { ...order, orderStatus: 'CANCELLED' } : order
                ),
                currentOrder: state.currentOrder && state.currentOrder.id === action.payload ?
                    { ...state.currentOrder, orderStatus: 'CANCELLED' } : state.currentOrder,
                error: null
            };
        case CANCEL_ORDER_REJECTED:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        case SET_ORDER_DATA:
            return { ...state, orderData: action.payload };
        default:
            return state;
    }
};

export default orderReducer;