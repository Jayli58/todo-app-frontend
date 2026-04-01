"use client";

import { useState } from "react";
import type { SnackbarType } from "../components/SharedSnackbar";

interface SnackbarState {
    open: boolean;
    type: SnackbarType;
    message: string;
    duration: number;
}

const defaultState: SnackbarState = {
    open: false,
    type: "success",
    message: "",
    duration: 3000,
};

export default function useSnackbar() {
    const [snackbar, setSnackbar] = useState<SnackbarState>(defaultState);

    const notify = (type: SnackbarType, message: string, duration = 3000) => {
        setSnackbar({ open: true, type, message, duration });
    };

    const closeSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return { snackbar, notify, closeSnackbar };
}
