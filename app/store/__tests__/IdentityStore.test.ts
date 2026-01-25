import { useIdentityStore } from "../IdentityStore";

describe("IdentityStore", () => {
    // reset store after each test to avoid state leaks
    afterEach(() => {
        useIdentityStore.setState({ identity: null });
    });

    it("defaults to null", () => {
        expect(useIdentityStore.getState().identity).toBeNull();
    });

    it("updates identity", () => {
        useIdentityStore.getState().setIdentity({
            email: "user@example.com",
            name: "Test",
            idToken: "id",
            accessToken: "access",
            refreshToken: "refresh",
        });

        expect(useIdentityStore.getState().identity?.email).toBe("user@example.com");
    });
});
