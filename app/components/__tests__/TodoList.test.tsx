import React from "react";
import { render, screen } from "@testing-library/react";
import TodoList from "../TodoList";
import { FilterType } from "../../dataType/FilterTypes";

const useFilterStoreMock = jest.fn();

jest.mock("../../store/FilterStore", () => ({
    useFilterStore: (selector: (state: { filter: FilterType }) => FilterType) =>
        useFilterStoreMock(selector),
}));

jest.mock("../TodoItem/TodoItem", () => ({
    __esModule: true,
    default: ({ todo }: { todo: { title: string } }) => (
        <li data-testid="todo-item">{todo.title}</li>
    ),
}));

describe("TodoList", () => {
    it("shows loading indicator when loading", () => {
        useFilterStoreMock.mockImplementation((selector) =>
            selector({ filter: FilterType.ALL })
        );

        render(
            <TodoList todos={[]} loading toggleTodo={jest.fn()} deleteTodo={jest.fn()} />
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("shows empty state message for active filter", () => {
        useFilterStoreMock.mockImplementation((selector) =>
            selector({ filter: FilterType.ACTIVE })
        );

        render(
            <TodoList todos={[]} loading={false} toggleTodo={jest.fn()} deleteTodo={jest.fn()} />
        );

        expect(screen.getByText("No active records.")).toBeInTheDocument();
    });

    it("renders todo items", () => {
        useFilterStoreMock.mockImplementation((selector) =>
            selector({ filter: FilterType.ALL })
        );

        render(
            <TodoList
                todos={[
                    { todoId: "1", title: "First", content: "", statusCode: "Incomplete" },
                    { todoId: "2", title: "Second", content: "", statusCode: "Complete" },
                ]}
                loading={false}
                toggleTodo={jest.fn()}
                deleteTodo={jest.fn()}
            />
        );

        expect(screen.getAllByTestId("todo-item")).toHaveLength(2);
    });
});
