import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    // only set to true if backend auth relies on cookies
    withCredentials: false,
});

// centralised api error handling
export interface ApiError {
    status: number | null;
    message: string;
    raw: unknown;
}

export const getApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { title?: string; message?: string; error?: { message?: string } } | undefined;
        return {
            status: error.response?.status ?? null,
            message: data?.title ?? data?.message ?? data?.error?.message ?? error.message ?? "Unknown error",
            raw: error,
        };
    }

    if (error instanceof Error) {
        return { status: null, message: error.message, raw: error };
    }

    return { status: null, message: "Unknown error", raw: error };
};

