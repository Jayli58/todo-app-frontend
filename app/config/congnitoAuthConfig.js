export const cognitoAuthConfig = {
    authority: `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_COGNITO_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID}`,
    client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID,
    redirect_uri: "http://localhost:3000",
    response_type: "code",
    scope: "openid email phone",
};
