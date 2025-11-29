"use client";

import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { setupAxiosInterceptors } from "./apiAuth";
import {setupAxiosErrors} from "./apiErrors";

// apply interceptor for attaching jwt token
export function AuthSetup() {
    const auth = useAuth();

    useEffect(() => {
        if (!auth || !auth.user) return;
        setupAxiosInterceptors(auth);
        setupAxiosErrors();
    }, [auth.user]);

    return null;
}
