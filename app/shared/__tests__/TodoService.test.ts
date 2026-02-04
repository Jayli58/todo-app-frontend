import { TODO_PAGE_LIMIT } from "../../config/PaginationConfig";
import {
    createTodoApi,
    deleteTodoApi,
    fetchTodosApi,
    searchTodosApi,
    updateTodoStatusApi,
    UpsertReminder,
} from "../TodoService";
import { api } from "../api/api";


jest.mock("../api/api", () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("TodoService", () => {
    it("fetches todos", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { items: [{ todoId: "1" }], nextToken: "token" },
            headers: { get: () => "token" },
        });

        const result = await fetchTodosApi();

        expect(api.get).toHaveBeenCalledWith("/todo", {
            params: { limit: TODO_PAGE_LIMIT },
        });
        expect(result).toEqual({
            items: [{ todoId: "1" }],
            nextToken: "token",
        });
    });

    it("creates a todo", async () => {
        (api.post as jest.Mock).mockResolvedValue({ data: { todoId: "2" } });

        await createTodoApi("Title", "Content");

        expect(api.post).toHaveBeenCalledWith("/todo", {
            title: "Title",
            content: "Content",
        });
    });

    it("updates status", async () => {
        (api.put as jest.Mock).mockResolvedValue({ data: { todoId: "3" } });

        await updateTodoStatusApi("3", "Complete");

        expect(api.put).toHaveBeenCalledWith("/todo/3", {
            statusCode: "Complete",
        });
    });

    it("deletes a todo", async () => {
        (api.delete as jest.Mock).mockResolvedValue({ data: true });

        await deleteTodoApi("4");

        expect(api.delete).toHaveBeenCalledWith("/todo/4");
    });

    it("searches todos", async () => {
        (api.get as jest.Mock).mockResolvedValue({ data: [] });

        await searchTodosApi("query");

        expect(api.get).toHaveBeenCalledWith("/todo/search", {
            params: { query: "query", limit: TODO_PAGE_LIMIT },
        });
    });

    it("upserts reminders", async () => {
        (api.put as jest.Mock).mockResolvedValue({ data: { ok: true } });

        await UpsertReminder("5", 123);

        expect(api.put).toHaveBeenCalledWith("/todo/5/reminder", {
            remindAtEpoch: 123,
        });
    });
});
