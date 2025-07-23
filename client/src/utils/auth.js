const LOCAL_PATH = 'token';

export const getToken = () => {
    return window.localStorage.getItem(LOCAL_PATH);
};

export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        const user = JSON.parse(decodedPayload);
        return user;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export const setToken = (token) => {
    window.localStorage.setItem(LOCAL_PATH, token);
};

export const removeToken = () => {
    window.localStorage.removeItem(LOCAL_PATH);
};