import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "../TodoItem";

const setDialogOpen = jest.fn();
let deletionDialogProps: any;
let timePickerDialogProps: any;

// Mock MUI Tooltip
jest.mock("@mui/material/Tooltip", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Dialog Store
jest.mock("../../../store/DialogStore", () => ({
    useDialogStore: (selector: (state: { setDialogOpen: jest.Mock }) => unknown) =>
        selector({ setDialogOpen }),
}));

// Mock DeletionDialog
jest.mock("../dialog/DeletionDialog", () => ({
    __esModule: true,
    default: (props: any) => {
        deletionDialogProps = props;
        return null;
    },
}));

// Mock TimePickerDialog
jest.mock("../dialog/TimePickerDialog", () => ({
    __esModule: true,
    default: (props: any) => {
        timePickerDialogProps = props;
        return null;
    },
}));

describe("TodoItem", () => {
    it("invokes toggleTodo when toggling", () => {
        const toggleTodo = jest.fn();
        const deleteTodo = jest.fn();

        render(
            <TodoItem
                todo={{
                    todoId: "1",
                    title: "Task",
                    content: "content",
                    statusCode: "Incomplete",
                    remindTimestamp: null,
                }}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
            />
        );

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);

        expect(toggleTodo).toHaveBeenCalledWith("1");
    });

    it("opens dialogs when buttons are clicked", () => {
        const toggleTodo = jest.fn();
        const deleteTodo = jest.fn();

        render(
            <TodoItem
                todo={{
                    todoId: "1",
                    title: "Task",
                    content: "content",
                    statusCode: "Incomplete",
                    remindTimestamp: null,
                }}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
            />
        );

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);
        fireEvent.click(buttons[2]);

        expect(timePickerDialogProps.open).toBe(true);
        expect(deletionDialogProps.open).toBe(true);
        expect(setDialogOpen).toHaveBeenCalledWith(true);
    });
});
