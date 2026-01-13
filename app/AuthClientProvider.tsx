"use client";

import dynamic from "next/dynamic";
import React from "react";


// lazy loading; enable client side rendering only;
const CognitoAuthProviderClient = dynamic(
    () => import("./auth/AuthProvider").then((m) => m.CognitoAuthProvider),
    { ssr: false }
);

export default function AuthClientProvider({ children }: { children: React.ReactNode }) {
    return <CognitoAuthProviderClient>{children}</CognitoAuthProviderClient>;
}
