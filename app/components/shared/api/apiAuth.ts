import { api } from "./api";

export function setupAxiosInterceptors(auth: any) {
    api.interceptors.request.use((config) => {
        const token = auth.user?.id_token;

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });
}
