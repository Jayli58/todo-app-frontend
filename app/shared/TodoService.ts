import {api} from "./api/api";

export async function fetchTodos() {
    const res = await api.get("/todo");
    return res.data;
}

export async function updateTodoStatus(todoId: string, status: string) {
    const res = await api.put(`/todo/${todoId}`, {
        statusCode: status
    });

    return res.data;
}
