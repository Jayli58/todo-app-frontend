import {api} from "./api/api";

export async function newFetchTodos() {
    const res = await api.get("/todo");
    return res.data;
}
