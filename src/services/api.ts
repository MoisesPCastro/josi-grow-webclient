import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    headers: {
        Authorization: process.env.NEXT_PUBLIC_AUTH_TOKEN,
    },
});

export default api;
