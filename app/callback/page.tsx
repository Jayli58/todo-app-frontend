"use client";

import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

// handle Cognito callback
export default function Callback() {
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isLoading && auth.isAuthenticated) {
            window.location.replace("/");
        }
    }, [auth.isLoading, auth.isAuthenticated]);

    return <div>Signing you in…</div>;
}
