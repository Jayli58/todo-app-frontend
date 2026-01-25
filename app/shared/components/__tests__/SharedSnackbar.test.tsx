import { render, screen, fireEvent } from "@testing-library/react";
import SharedSnackbar from "../SharedSnackbar";

jest.mock("@mui/material/Snackbar", () => ({
    __esModule: true,
    default: ({ children, onClose }: any) => (
        <div>
            <button type="button" onClick={() => onClose?.({}, "timeout")}>Close</button>
            {children}
        </div>
    ),
}));

jest.mock("@mui/material/Alert", () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));

describe("SharedSnackbar", () => {
    it("renders message and closes", () => {
        const onClose = jest.fn();

        render(
            <SharedSnackbar
                open
                type="success"
                message="Saved"
                onClose={onClose}
                duration={1000}
            />
        );

        expect(screen.getByText("Saved")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(onClose).toHaveBeenCalled();
    });
});
