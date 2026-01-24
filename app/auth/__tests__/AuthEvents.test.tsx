import { render, waitFor } from "@testing-library/react";
import { AuthEvents } from "../AuthEvents";
import { useAuth } from "react-oidc-context";
import type { AuthContextProps } from "react-oidc-context";
import type { User } from "oidc-client-ts";
import type { UserManagerEvents } from "oidc-client-ts";
import { useIdentityStore } from "../../store/IdentityStore";

jest.mock("react-oidc-context", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../store/IdentityStore", () => ({
    useIdentityStore: jest.fn(),
}));

const mockedUseIdentityStore = useIdentityStore as jest.MockedFunction<typeof useIdentityStore>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("AuthEvents", () => {
    it("sets identity from initial auth user", async () => {
        const setIdentity = jest.fn();
        const user = {
            profile: { email: "user@example.com", name: "Test User" },
            id_token: "id-token",
            access_token: "access-token",
            refresh_token: "refresh-token",
        } as User;

        mockedUseIdentityStore.mockImplementation((selector) =>
            selector({ identity: null, setIdentity })
        );
        mockedUseAuth.mockReturnValue({
            user,
            events: {
                addUserLoaded: jest.fn(),
                removeUserLoaded: jest.fn(),
                addAccessTokenExpiring: jest.fn(),
                removeAccessTokenExpiring: jest.fn(),
                addAccessTokenExpired: jest.fn(),
                removeAccessTokenExpired: jest.fn(),
                addSilentRenewError: jest.fn(),
                removeSilentRenewError: jest.fn(),
            } as unknown as UserManagerEvents,
        } as unknown as AuthContextProps);

        render(<AuthEvents />);

        await waitFor(() => {
            expect(setIdentity).toHaveBeenCalledWith({
                email: "user@example.com",
                name: "Test User",
                idToken: "id-token",
                accessToken: "access-token",
                refreshToken: "refresh-token",
            });
        });
    });

    it("cleans up auth event handlers by reference", () => {
        const setIdentity = jest.fn();
        const events = {
            addUserLoaded: jest.fn(),
            removeUserLoaded: jest.fn(),
            addAccessTokenExpiring: jest.fn(),
            removeAccessTokenExpiring: jest.fn(),
            addAccessTokenExpired: jest.fn(),
            removeAccessTokenExpired: jest.fn(),
            addSilentRenewError: jest.fn(),
            removeSilentRenewError: jest.fn(),
        };

        mockedUseIdentityStore.mockImplementation((selector) =>
            selector({ identity: null, setIdentity })
        );
        mockedUseAuth.mockReturnValue({
            user: null,
            events: events as unknown as UserManagerEvents,
        } as unknown as AuthContextProps);

        // Renders the component and gives you a function to unmount it
        const { unmount } = render(<AuthEvents />);

        // get 1st handlerFn in call history;
        const onUserLoaded = events.addUserLoaded.mock.calls[0][0];
        const onAccessTokenExpiring = events.addAccessTokenExpiring.mock.calls[0][0];
        const onAccessTokenExpired = events.addAccessTokenExpired.mock.calls[0][0];
        const onSilentRenewError = events.addSilentRenewError.mock.calls[0][0];

        unmount();

        expect(events.removeUserLoaded).toHaveBeenCalledWith(onUserLoaded);
        expect(events.removeAccessTokenExpiring).toHaveBeenCalledWith(onAccessTokenExpiring);
        expect(events.removeAccessTokenExpired).toHaveBeenCalledWith(onAccessTokenExpired);
        expect(events.removeSilentRenewError).toHaveBeenCalledWith(onSilentRenewError);
    });
});
