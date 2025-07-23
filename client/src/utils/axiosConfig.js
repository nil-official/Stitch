import axios from 'axios';
import BASE_URL from './baseurl';
import { getToken } from './auth';

axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;