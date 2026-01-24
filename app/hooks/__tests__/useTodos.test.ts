import { renderHook, act, waitFor } from "@testing-library/react";
import { useTodos } from "../useTodos";
import { FilterType } from "../../dataType/FilterTypes";
import {
    createTodoApi,
    deleteTodoApi,
    fetchTodosApi,
    searchTodosApi,
    updateTodoStatusApi,
    UpsertReminder,
} from "../../shared/TodoService";
import { useLoadingStore } from "../../store/LoadingStore";

const useAuthMock = jest.fn();
const useFilterStoreMock = jest.fn();
const useIdentityStoreMock = jest.fn();

jest.mock("react-oidc-context", () => ({
    useAuth: () => useAuthMock(),
}));

jest.mock("../../store/FilterStore", () => ({
    useFilterStore: (selector: (state: { filter: FilterType }) => unknown) =>
        useFilterStoreMock(selector),
}));

jest.mock("../../store/IdentityStore", () => ({
    useIdentityStore: (selector: (state: { identity: { idToken: string } | null }) => unknown) =>
        useIdentityStoreMock(selector),
}));

jest.mock("../../shared/TodoService", () => ({
    fetchTodosApi: jest.fn(),
    createTodoApi: jest.fn(),
    deleteTodoApi: jest.fn(),
    searchTodosApi: jest.fn(),
    updateTodoStatusApi: jest.fn(),
    UpsertReminder: jest.fn(),
}));

describe("useTodos", () => {
    beforeEach(() => {
        useLoadingStore.setState({ loadingActions: new Set() });
        useAuthMock.mockReturnValue({ isAuthenticated: true });
        useIdentityStoreMock.mockImplementation((selector) =>
            selector({ identity: { idToken: "token" } })
        );
        useFilterStoreMock.mockImplementation((selector) =>
            selector({ filter: FilterType.ACTIVE })
        );
    });

    it("loads todos and filters by active", async () => {
        (fetchTodosApi as jest.Mock).mockResolvedValue([
            { todoId: "1", title: "A", content: "", statusCode: "Incomplete" },
            { todoId: "2", title: "B", content: "", statusCode: "Complete" },
        ]);

        const { result } = renderHook(() => useTodos());

        await waitFor(() => {
            expect(fetchTodosApi).toHaveBeenCalled();
            expect(result.current.filteredTodos).toHaveLength(1);
        });

        expect(fetchTodosApi).toHaveBeenCalled();
        expect(result.current.filteredTodos).toHaveLength(1);
        expect(result.current.badgeNums.totalNum).toBe(2);
        expect(result.current.badgeNums.activeNum).toBe(1);
        expect(result.current.badgeNums.completedNum).toBe(1);
    });

    it("validates empty title on addTodo", async () => {
        const notify = jest.fn();
        const { result } = renderHook(() => useTodos(notify));

        let response: boolean | undefined;
        await act(async () => {
            response = await result.current.addTodo("", "content");
        });

        expect(response).toBe(false);
        expect(createTodoApi).not.toHaveBeenCalled();
        expect(notify).toHaveBeenCalledWith("error", "Todo title cannot be empty!");
    });

    it("deletes todo and notifies", async () => {
        (fetchTodosApi as jest.Mock).mockResolvedValue([
            { todoId: "1", title: "A", content: "", statusCode: "Incomplete" },
        ]);
        (deleteTodoApi as jest.Mock).mockResolvedValue(true);
        const notify = jest.fn();

        const { result } = renderHook(() => useTodos(notify));

        await waitFor(() => {
            expect(result.current.todos).toHaveLength(1);
        });

        await act(async () => {
            await result.current.deleteTodo("1");
        });

        expect(result.current.todos).toHaveLength(0);
        expect(notify).toHaveBeenCalledWith("success", "Todo deleted successfully!");
    });
});
