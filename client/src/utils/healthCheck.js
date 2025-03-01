import axios from './axiosConfig'

const healthCheck = async () => {
    try {
        const res = await axios.get('/public/');
        if (res.status === 200) {
            return true;
        }
    } catch (error) {
        // console.log('Backend is down:', error);
    }
    return false;
};

export default healthCheck;