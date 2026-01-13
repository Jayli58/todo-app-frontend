"use client";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import {useIdentityStore} from "../store/IdentityStore";
import {User} from "oidc-client-ts";

export function AuthEvents() {
    const auth = useAuth();

    const setIdentity = useIdentityStore(s => s.setIdentity);

    useEffect(() => {
        if (!auth.events) return;

        // fires on login and on silent renew
        // extract id info
        const onUserLoaded = (user: User) => {
            console.log("User state changes... in Auth event");
            console.log("user id token: ", user.id_token);

            setIdentity({
                email: user.profile?.email ?? "",
                name: user.profile?.name ?? "",
                idToken: user.id_token ?? "",
                accessToken: user.access_token ?? "",
                refreshToken: user.refresh_token ?? "",
            });
        };

        auth.events.addUserLoaded(onUserLoaded);

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
            auth.events.removeUserLoaded(onUserLoaded);
        };

    }, [auth.events, setIdentity]);

    return null;
}
