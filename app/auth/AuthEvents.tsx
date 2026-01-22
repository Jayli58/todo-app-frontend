"use client";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import {useIdentityStore} from "../store/IdentityStore";
import {User} from "oidc-client-ts";

export function AuthEvents() {
    const auth = useAuth();

    const setIdentity = useIdentityStore(s => s.setIdentity);

    // initial user info set
    useEffect(() => {
        if (!auth.user) return;

        setIdentity({
            email: auth.user.profile?.email ?? "",
            name: auth.user.profile?.name ?? "",
            idToken: auth.user.id_token ?? "",
            accessToken: auth.user.access_token ?? "",
            refreshToken: auth.user.refresh_token ?? "",
        });
    }, [auth.user, setIdentity]);

    useEffect(() => {
        if (!auth.events) return;

        // fires on silent renew
        // extract id info
        const onUserLoaded = (user: User) => {
            // console.log("User state changes... in Auth event");
            // console.log("user id token: ", user.id_token);

            setIdentity({
                email: user.profile?.email ?? "",
                name: user.profile?.name ?? "",
                idToken: user.id_token ?? "",
                accessToken: user.access_token ?? "",
                refreshToken: user.refresh_token ?? "",
            });
        };

        auth.events.addUserLoaded(onUserLoaded);

        const onAccessTokenExpiring = () => {
            console.log("Token expiring, trying silent renew...");
        };

        const onAccessTokenExpired = () => {
            console.log("Token expired");
        };

        const onSilentRenewError = (e: Error) => {
            console.error("Silent renew error", e);
        };

        auth.events.addAccessTokenExpiring(onAccessTokenExpiring);
        auth.events.addAccessTokenExpired(onAccessTokenExpired);
        auth.events.addSilentRenewError(onSilentRenewError);

        // cleanup
        return () => {
            auth.events.removeAccessTokenExpiring(onAccessTokenExpiring);
            auth.events.removeAccessTokenExpired(onAccessTokenExpired);
            auth.events.removeSilentRenewError(onSilentRenewError);
            auth.events.removeUserLoaded(onUserLoaded);
        };

    }, [auth.events, setIdentity]);

    return null;
}
