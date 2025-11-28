"use client";

import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { setupAxiosInterceptors } from "./apiAuth";

// apply interceptor for attaching jwt token
export function AuthSetup() {
    const auth = useAuth();

    useEffect(() => {
        if (!auth || !auth.user) return;
        setupAxiosInterceptors(auth);
    }, [auth.user]);

    return null;
}
