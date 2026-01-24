import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTodoFormDialog from "../CreateTodoFormDialog";


describe("CreateTodoFormDialog", () => {
    it("submits and resets on success", async () => {
        const addTodo = jest.fn().mockResolvedValue(true);
        const onClose = jest.fn();

        render(<CreateTodoFormDialog addTodo={addTodo} open onClose={onClose} />);

        fireEvent.change(screen.getByLabelText("Title"), {
            target: { value: "New" },
        });
        fireEvent.change(screen.getByLabelText("Content"), {
            target: { value: "Details" },
        });

        const form = document.getElementById("todoForm") as HTMLFormElement;
        fireEvent.submit(form);

        await waitFor(() => {
            expect(addTodo).toHaveBeenCalledWith("New", "Details");
        });
        expect(onClose).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByLabelText("Title")).toHaveValue("");
        });
    });

    it("closes on Escape", () => {
        const addTodo = jest.fn().mockResolvedValue(true);
        const onClose = jest.fn();

        render(<CreateTodoFormDialog addTodo={addTodo} open onClose={onClose} />);

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onClose).toHaveBeenCalled();
    });
});
