"use client";

import { AuthProvider, hasAuthParams, useAuth } from "react-oidc-context";
import { cognitoAuthConfig } from "../config/CongnitoAuthConfig";
import { useEffect, useRef } from "react";
import { AuthEvents } from "./AuthEvents";
import { AuthSetup } from "../shared/api/AuthSetup";

function CognitoAuthGuard({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    // need to remember the state across renders without causing re-renders
    const triedSilent = useRef(false);
    const triedRedirect = useRef(false);

    // auto-redirect when unauthenticated
    useEffect(() => {
        // skip callback processing
        if (hasAuthParams()) return;

        if (!auth.isLoading && !auth.isAuthenticated) {
            if (!triedSilent.current) {
                triedSilent.current = true;

                // sign in with refresh token first
                auth.signinSilent().catch(() => {
                    // silent failed; redirect once
                    if (!triedRedirect.current) {
                        triedRedirect.current = true;
                        auth.signinRedirect();
                    }
                });

                return;
            }

            // normal sign in process
            if (!triedRedirect.current) {
                triedRedirect.current = true;
                auth.signinRedirect();
            }
        }
    }, [auth.isLoading, auth.isAuthenticated]);

    // When auth succeeds again, reset both flags
    useEffect(() => {
        if (auth.isAuthenticated) {
            triedSilent.current = false;
            triedRedirect.current = false;
        }
    }, [auth.isAuthenticated]);

    if (auth.isLoading) return <div>Loading…</div>;
    if (!auth.isAuthenticated) return <div>Redirecting…</div>;

    // const { isLoading, isAuthenticated, error } = useAutoSignin({signinMethod: "signinRedirect"});
    //
    // if (isLoading) {
    //     return <div>Signing you in/out...</div>;
    // }
    //
    // if (!isAuthenticated) {
    //     return <div>Unable to log in</div>;
    // }
    //
    // if(error) {
    //     return <div>An error occured</div>
    // }


    return <>{children}</>;
}

export function CognitoAuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider {...cognitoAuthConfig}>
            <CognitoAuthGuard>
                <AuthEvents />
                {/*apply interceptor with jwt*/}
                <AuthSetup />
                {children}
            </CognitoAuthGuard>
        </AuthProvider>
    );
}
