import { api } from "./api";

// axios error handling
export function setupAxiosErrors() {
    api.interceptors.response.use(
        (res) => res,
        (error) => {
            const status = error.response?.status;

            error.friendlyMessage =
                status === 404 ? "Todo not found" :
                status === 401 ? "Unauthorized — please login" :
                    "Something went wrong";

            return Promise.reject(error);
        }
    );
}
