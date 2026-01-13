import {WebStorageStateStore} from "oidc-client-ts";

export const cognitoAuthConfig = {
    authority: `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_COGNITO_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID}`,
    client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/callback/`,
    response_type: "code",
    scope: "openid email profile phone",
    automaticSilentRenew: true,
    // URL cleanup -- not needed as callback/page.tsx would handle that
    // onSigninCallback: () => {
    //     window.history.replaceState({}, document.title, window.location.pathname);
    // },
};
