"use client";

import {AuthProvider, useAuth} from "react-oidc-context";
import { cognitoAuthConfig } from "../config/congnitoAuthConfig";
import {useIdentityStore} from "../services/IdentityStore";
import {useEffect} from "react";

function CognitoAuthGuard({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const setIdentity = useIdentityStore(s => s.setIdentity);

    // Logs when token is going to expire
    auth.events.addAccessTokenExpiring(() => {
        console.log("Token is expiring, attempting silent renew...");
    });

    // Logs when token has expired
    auth.events.addAccessTokenExpired(() => {
        console.log("Access token expired");
    });

    // Logs silent renew errors
    auth.events.addSilentRenewError((e) => {
        console.error("Silent renew error:", e);
    });

    // auto-redirect when unauthenticated
    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            auth.signinRedirect();
        }
    }, [auth.isLoading, auth.isAuthenticated]);

    // extract id info
    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            setIdentity({
                email: auth.user.profile?.email ?? "",
                name: auth.user.profile?.name ?? "",
                idToken: auth.user.id_token ?? "",
                accessToken: auth.user.access_token ?? "",
                refreshToken: auth.user.refresh_token ?? "",
            });
        }
    }, [auth.isAuthenticated, auth.user, setIdentity]);

    if (auth.isLoading) return <div>Loading…</div>;
    if (!auth.isAuthenticated) return <div>Redirecting…</div>;

    return <>{children}</>;
}

export function CognitoAuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider {...cognitoAuthConfig}>
            <CognitoAuthGuard>
                {children}
            </CognitoAuthGuard>
        </AuthProvider>
    );
}
