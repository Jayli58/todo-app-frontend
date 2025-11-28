export interface Todo {
    todoId: number;
    title: string;
    content: string;
    statusCode: string;
    remindTimestamp: number | null;
}
