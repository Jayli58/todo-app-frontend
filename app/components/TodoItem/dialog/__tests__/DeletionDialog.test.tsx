import { render, screen, fireEvent } from "@testing-library/react";
import DeletionDialog from "../DeletionDialog";

describe("DeletionDialog", () => {
    it("calls deleteTodo with todo id", () => {
        const deleteTodo = jest.fn();
        const onClose = jest.fn();

        render(
            <DeletionDialog
                todo={{
                    todoId: "42",
                    title: "Task",
                    content: "Content",
                    statusCode: "Incomplete",
                    remindTimestamp: null
                }}
                open
                onClose={onClose}
                deleteTodo={deleteTodo}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Delete" }));

        expect(deleteTodo).toHaveBeenCalledWith("42");
    });
});
