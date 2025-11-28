"use client";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export function AuthEvents() {
    const auth = useAuth();

    useEffect(() => {
        if (!auth.events) return;

        auth.events.addAccessTokenExpiring(() => {
            console.log("Token expiring, trying silent renew...");
        });

        auth.events.addAccessTokenExpired(() => {
            console.log("Token expired");
        });

        auth.events.addSilentRenewError((e) => {
            console.error("Silent renew error", e);
        });

        // cleanup
        return () => {
            auth.events.removeAccessTokenExpiring(() => {});
            auth.events.removeAccessTokenExpired(() => {});
            auth.events.removeSilentRenewError(() => {});
        };

    }, [auth]);

    return null;
}
