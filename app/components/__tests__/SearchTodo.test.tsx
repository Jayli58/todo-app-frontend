import { render, screen, fireEvent } from "@testing-library/react";
import SearchTodo from "../SearchTodo";

describe("SearchTodo", () => {
    it("submits the search text", () => {
        const searchTodo = jest.fn().mockResolvedValue(undefined);

        render(<SearchTodo searchTodo={searchTodo} />);

        fireEvent.change(screen.getByPlaceholderText("Enter keyword to search..."), {
            target: { value: "hello" },
        });

        const submitButton = screen.getByRole("button");
        fireEvent.submit(submitButton.closest("form") as HTMLFormElement);

        expect(searchTodo).toHaveBeenCalledWith("hello");
    });
});
