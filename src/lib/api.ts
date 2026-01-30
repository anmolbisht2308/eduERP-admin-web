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
        const originalRequest = error.config;

        // Prevent infinite loop
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh token API
                // Note: The browser automatically sends the httpOnly refreshToken cookie with this request
                await api.post('/auth/refresh-token');

                // If successful, the backend sets a new 'token' cookie.
                // We retry the original request.
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
