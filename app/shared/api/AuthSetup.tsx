"use client";

import { useEffect } from "react";
import { setupAxiosInterceptors } from "./apiAuth";

// apply interceptor for attaching jwt token
export function AuthSetup() {

    // to run after the component is mounted
    useEffect(() => {
        setupAxiosInterceptors();
    }, []);

    return null;
}
