import {api} from "./api/api";
import {Todo} from "../dataType/Todo";

export async function fetchTodosApi(): Promise<Todo[]> {
    const res = await api.get("/todo");
    return res.data;
}

export async function createTodoApi(title: string, content: string): Promise<Todo> {
    const res = await api.post(`/todo`, {
        title: title,
        content: content
    });

    return res.data;
}

export async function updateTodoStatusApi(todoId: string, status: string): Promise<Todo> {
    const res = await api.put(`/todo/${todoId}`, {
        statusCode: status
    });

    return res.data;
}

export async function deleteTodoApi(todoId: string): Promise<boolean> {
    const res = await api.delete(`/todo/${todoId}`);
    return res.data;
}

export async function searchTodosApi(query: string): Promise<Todo[]> {
    const res = await api.get("/todo/search", {
        params: {query}
    });
    return res.data;
}

export async function UpsertReminder(todoId: string, remindAtEpoch: number) {
    const res = await api.put(`/todo/${todoId}/reminder`, {
        remindAtEpoch: remindAtEpoch
    });

    return res.data;
}




