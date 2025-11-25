export interface Todo {
    id: number;
    text: string;
    content: string;
    completed: boolean;
    remindTimestamp: number | null;
}
