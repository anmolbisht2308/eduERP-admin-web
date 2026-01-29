import axios from 'axios';
import { getCookie } from 'cookies-next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // For cookie handling (refreshToken)
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getCookie('token'); // We'll store access token in cookie or localstorage
    // Ideally, access token in memory/header, refresh in cookie.
    // For this MVP, let's assume we might store token in cookie for client access too or localStorage

    if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('No valid token found in cookies');
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 (Refresh Token) logic here later
        return Promise.reject(error);
    }
);
