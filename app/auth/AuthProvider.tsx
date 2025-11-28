"use client";

import {AuthProvider, useAuth} from "react-oidc-context";
import {cognitoAuthConfig} from "../config/CongnitoAuthConfig";
import {useIdentityStore} from "../store/IdentityStore";
import {useEffect} from "react";
import {AuthEvents} from "./AuthEvents";
import {AuthSetup} from "../components/shared/api/AuthSetup";

function CognitoAuthGuard({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const setIdentity = useIdentityStore(s => s.setIdentity);

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
                <AuthEvents/>
                {/*apply interceptor with jwt*/}
                <AuthSetup/>
                {children}
            </CognitoAuthGuard>
        </AuthProvider>
    );
}
