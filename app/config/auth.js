"use client";

import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
} from "amazon-cognito-identity-js";

const pool = new CognitoUserPool({
    UserPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID,
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
});

export function login(username, password) {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({ Username: username, Pool: pool });
        const auth = new AuthenticationDetails({
            Username: username,
            Password: password
        });

        user.authenticateUser(auth, {
            onSuccess: (session) => {
                resolve({
                    idToken: session.getIdToken().getJwtToken(),
                    accessToken: session.getAccessToken().getJwtToken(),
                    refreshToken: session.getRefreshToken().getToken()
                });
            },
            onFailure: reject
        });
    });
}

