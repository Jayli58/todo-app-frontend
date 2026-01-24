import { setupAxiosErrors } from "../apiErrors";
import { api } from "../api";

jest.mock("../api", () => ({
    api: {
        interceptors: {
            response: {
                use: jest.fn(),
            },
        },
    },
}));

describe("setupAxiosErrors", () => {
    it("adds friendly message for 401", async () => {
        setupAxiosErrors();

        const onRejected = (api.interceptors.response.use as jest.Mock).mock.calls[0][1];
        const error = { response: { status: 401 } };

        await expect(onRejected(error)).rejects.toEqual({
            response: { status: 401 },
            friendlyMessage: "Unauthorized — please login",
        });
    });
});
