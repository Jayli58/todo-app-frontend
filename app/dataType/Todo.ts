export interface Todo {
    todoId: string;
    title: string;
    content: string;
    statusCode: string;
    remindTimestamp: number | null;
}
