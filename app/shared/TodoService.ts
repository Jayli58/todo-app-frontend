import { api } from "./api/api";
import { Todo } from "../dataType/Todo";
import { LoadingAction, withLoading } from "../store/LoadingStore";
import { TODO_PAGE_LIMIT } from "../config/PaginationConfig";


export interface PaginatedTodos {
    items: Todo[];
    nextToken: string | null;
}

export async function fetchTodosApi(
    limit: number = TODO_PAGE_LIMIT,
    paginationToken: string | null = null,
    loadingAction: LoadingAction = "fetch"
): Promise<PaginatedTodos> {
    return withLoading(loadingAction, async () => {
        const params: { limit: number; lastKey?: string } = { limit };
        if (paginationToken) {
            params.lastKey = paginationToken;
        }

        const res = await api.get("/todo", { params });
        const rawToken = typeof res.headers?.get === "function"
            ? res.headers.get("x-next-page-key") : null;
        const nextToken = typeof rawToken === "string" ? rawToken : null;
        return {
            items: res.data?.items ?? res.data ?? [],
            nextToken,
        };
    });
}

export async function createTodoApi(title: string, content: string): Promise<Todo> {
    return withLoading("create", async () => {
        const res = await api.post(`/todo`, {
            title: title,
            content: content
        });
        return res.data;
    });
}

export async function updateTodoStatusApi(todoId: string, status: string): Promise<Todo> {
    return withLoading(`toggle:${todoId}`, async () => {
        const res = await api.put(`/todo/${todoId}`, {
            statusCode: status
        });
        return res.data;
    });
}

export async function deleteTodoApi(todoId: string): Promise<boolean> {
    return withLoading(`delete:${todoId}`, async () => {
        const res = await api.delete(`/todo/${todoId}`);
        return res.data;
    });
}

export async function searchTodosApi(query: string): Promise<Todo[]> {
    return withLoading("search", async () => {
        const res = await api.get("/todo/search", {
            params: { query }
        });
        return res.data;
    });
}

export async function UpsertReminder(todoId: string, remindAtEpoch: number) {
    return withLoading(`reminder:${todoId}`, async () => {
        const res = await api.put(`/todo/${todoId}/reminder`, {
            remindAtEpoch: remindAtEpoch
        });
        return res.data;
    });
}
