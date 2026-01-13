"use client";

import {AuthProvider, useAuth, useAutoSignin} from "react-oidc-context";
import {cognitoAuthConfig} from "../config/CongnitoAuthConfig";
import {useEffect} from "react";
import {AuthEvents} from "./AuthEvents";
import {AuthSetup} from "../shared/api/AuthSetup";

function CognitoAuthGuard({ children }: { children: React.ReactNode }) {
    // const auth = useAuth();
    //
    // // auto-redirect when unauthenticated
    // useEffect(() => {
    //     if (!auth.isLoading && !auth.isAuthenticated) {
    //         auth.signinRedirect();
    //     }
    // }, [auth.isLoading, auth.isAuthenticated]);
    //
    // if (auth.isLoading) return <div>Loading…</div>;
    // if (!auth.isAuthenticated) return <div>Redirecting…</div>;

    const { isLoading, isAuthenticated, error } = useAutoSignin({signinMethod: "signinRedirect"});

    if (isLoading) {
        return <div>Signing you in/out...</div>;
    }

    if (!isAuthenticated) {
        return <div>Unable to log in</div>;
    }

    if(error) {
        return <div>An error occured</div>
    }


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
