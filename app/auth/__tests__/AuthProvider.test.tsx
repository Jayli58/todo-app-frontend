import React from "react";
import { render, waitFor } from "@testing-library/react";
import { CognitoAuthProvider } from "../AuthProvider";

const useAuthMock = jest.fn();
const hasAuthParamsMock = jest.fn();

jest.mock("react-oidc-context", () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useAuth: () => useAuthMock(),
    hasAuthParams: () => hasAuthParamsMock(),
}));

jest.mock("../AuthEvents", () => ({
    AuthEvents: () => null,
}));

jest.mock("../../shared/api/AuthSetup", () => ({
    AuthSetup: () => null,
}));

describe("CognitoAuthProvider", () => {
    beforeEach(() => {
        hasAuthParamsMock.mockReturnValue(false);
    });

    it("attempts silent sign-in when unauthenticated", async () => {
        const signinSilent = jest.fn().mockResolvedValue(undefined);
        const signinRedirect = jest.fn();

        useAuthMock.mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
            signinSilent,
            signinRedirect,
        });

        render(
            <CognitoAuthProvider>
                <div>child</div>
            </CognitoAuthProvider>
        );

        await waitFor(() => {
            expect(signinSilent).toHaveBeenCalled();
        });
        expect(signinRedirect).not.toHaveBeenCalled();
    });

    it("redirects when silent sign-in fails", async () => {
        const signinSilent = jest.fn().mockRejectedValue(new Error("fail"));
        const signinRedirect = jest.fn();

        useAuthMock.mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
            signinSilent,
            signinRedirect,
        });

        render(
            <CognitoAuthProvider>
                <div>child</div>
            </CognitoAuthProvider>
        );

        await waitFor(() => {
            expect(signinSilent).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(signinRedirect).toHaveBeenCalled();
        });
    });
});
