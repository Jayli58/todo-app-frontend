import React from "react";
import { render } from "@testing-library/react";
import { AuthSetup } from "../AuthSetup";

const setupAxiosInterceptors = jest.fn();

jest.mock("../apiAuth", () => ({
    setupAxiosInterceptors: () => setupAxiosInterceptors(),
}));

describe("AuthSetup", () => {
    it("registers axios interceptors on mount", () => {
        render(<AuthSetup />);

        expect(setupAxiosInterceptors).toHaveBeenCalled();
    });
});
