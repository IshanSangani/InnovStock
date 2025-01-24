import axios from 'axios';

// Add a response interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            
            // Redirect to login if needed
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Add a request interceptor to always include credentials
axios.interceptors.request.use(
    config => {
        config.withCredentials = true;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
