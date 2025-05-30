export const BASE_ROUTES = {
    HOME: '/',
    AUTH: '/auth',
    USER: '/user',
    ADMIN: '/admin',
    SEARCH: '/search',
    PRODUCT: '/product',
    CHECKOUT: '/checkout',
    HELP: '/help',
};

export const AUTH_ROUTES = {
    ROOT: BASE_ROUTES.AUTH,
    LOGIN: `${BASE_ROUTES.AUTH}/login`,
    REGISTER: `${BASE_ROUTES.AUTH}/register`,
    FORGOT_PASSWORD: `${BASE_ROUTES.AUTH}/forgot-password`,
    RESET_PASSWORD: `${BASE_ROUTES.AUTH}/reset-password`,
    VERIFY_EMAIL: `${BASE_ROUTES.AUTH}/verify`,
};

export const USER_ROUTES = {
    ROOT: BASE_ROUTES.USER,
    ORDERS: `${BASE_ROUTES.USER}/orders`,
    ORDER_DETAILS: (id = ':id') => `${BASE_ROUTES.USER}/orders/${id}`,
    ACCOUNT: `${BASE_ROUTES.USER}/account`,
    ADDRESS: `${BASE_ROUTES.USER}/address`,
    WISHLIST: `${BASE_ROUTES.USER}/wishlist`,
    SETTINGS: `${BASE_ROUTES.USER}/settings`,
};

export const ADMIN_ROUTES = {
    ROOT: BASE_ROUTES.ADMIN,
    DASHBOARD: `${BASE_ROUTES.ADMIN}/dashboard`,
    PRODUCTS: `${BASE_ROUTES.ADMIN}/products`,
    PRODUCT_CREATE: `${BASE_ROUTES.ADMIN}/products/create`,
    PRODUCT_EDIT: (id = ':id') => `${BASE_ROUTES.ADMIN}/products/edit/${id}`,
    ORDERS: `${BASE_ROUTES.ADMIN}/orders`,
    USERS: `${BASE_ROUTES.ADMIN}/users`,
    ISSUES: `${BASE_ROUTES.ADMIN}/issues`,
};

export const CHECKOUT_ROUTES = {
    ROOT: BASE_ROUTES.CHECKOUT,
    CART: `${BASE_ROUTES.CHECKOUT}/cart`,
    SHIPPING: `${BASE_ROUTES.CHECKOUT}/shipping`,
    SUMMARY: `${BASE_ROUTES.CHECKOUT}/summary`,
    PAYMENT: `${BASE_ROUTES.CHECKOUT}/payment`,
};

export const PRODUCT_ROUTES = {
    ROOT: BASE_ROUTES.PRODUCT,
    PRODUCT_DETAILS: (id = ':id') => `${BASE_ROUTES.PRODUCT}/${id}`,
};