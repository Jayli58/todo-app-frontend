import { render, screen, fireEvent } from "@testing-library/react";
import CreateTodo from "../CreateTodo";

const setDialogOpen = jest.fn();
let dialogProps: any;

jest.mock("../../../store/dialogStore", () => ({
    useDialogStore: (selector: (state: { setDialogOpen: jest.Mock }) => unknown) =>
        selector({ setDialogOpen }),
}));

jest.mock("../dialog/CreateTodoFormDialog", () => ({
    __esModule: true,
    default: (props: any) => {
        dialogProps = props;
        return null;
    },
}));

describe("CreateTodo", () => {
    it("opens dialog on click", () => {
        render(<CreateTodo addTodo={jest.fn()} />);

        // simulates a real user click on the “Create todo” button
        fireEvent.click(screen.getByRole("button", { name: "Create todo" }));

        expect(dialogProps.open).toBe(true);
        expect(setDialogOpen).toHaveBeenCalledWith(true);
    });
});
