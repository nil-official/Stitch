import BASE_URL from "./baseurl";

const healthCheck = async () => {
    try {
        const res = await fetch(`${BASE_URL}/public`);
        return !!res;
    } catch (error) {
        return false;
    }
};

export default healthCheck;