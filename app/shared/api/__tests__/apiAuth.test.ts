import { setupAxiosInterceptors } from "../apiAuth";
import { api } from "../api";
import { useIdentityStore } from "../../../store/IdentityStore";

jest.mock("../api", () => ({
    api: {
        interceptors: {
            request: {
                use: jest.fn(),
            },
        },
    },
}));

jest.mock("../../../store/IdentityStore", () => ({
    useIdentityStore: {
        getState: jest.fn(),
    },
}));

describe("setupAxiosInterceptors", () => {
    it("adds auth header when token exists", () => {
        (useIdentityStore.getState as jest.Mock).mockReturnValue({
            identity: { idToken: "token" },
        });

        setupAxiosInterceptors();

        const interceptor = (api.interceptors.request.use as jest.Mock).mock.calls[0][0];
        const config = interceptor({ headers: {} });

        expect(config.headers.Authorization).toBe("Bearer token");
    });

    it("skips auth header when no token", () => {
        (useIdentityStore.getState as jest.Mock).mockReturnValue({ identity: null });

        setupAxiosInterceptors();

        const interceptor = (api.interceptors.request.use as jest.Mock).mock.calls[1][0];
        const config = interceptor({});

        expect(config.headers).toBeUndefined();
    });
});
