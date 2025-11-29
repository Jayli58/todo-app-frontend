import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: false,
});

// axios error handling
api.interceptors.response.use(
    (response) => response,    // just return success normally
    (error) => {
        const status = error.response?.status;

        // Attach "friendlyMessage" for UI
        error.friendlyMessage =
            status === 404 ? "Todo item not found" :
            status === 401 ? "Unauthorized. Please log in again." :
                "Something went wrong";

        return Promise.reject(error);
    }
);
