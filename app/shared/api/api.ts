import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    // only set to true if backend auth relies on cookies
    withCredentials: false,
});

