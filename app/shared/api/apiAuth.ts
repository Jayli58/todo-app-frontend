import { api } from "./api";
import {useIdentityStore} from "../../store/IdentityStore";

export function setupAxiosInterceptors() {
    api.interceptors.request.use((config) => {
        const token = useIdentityStore.getState().identity?.idToken;

        if (token) {
            // ensure headers exists
            config.headers = config.headers ?? {};
            // add token to header
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });
}
