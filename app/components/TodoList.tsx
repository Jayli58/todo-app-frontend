import { Todo } from "../dataType/Todo";
import TodoItem from "./TodoItem/TodoItem";
import { useFilterStore } from "../store/FilterStore";
import { FilterType } from "../dataType/FilterTypes";
import { CircularProgress } from "@mui/material";

interface TodoListProps {
    todos: Todo[];
    toggleTodo: (todoId: string) => void;
    deleteTodo: (todoId: string) => void;
    loading: boolean;
}

function TodoList({ todos, toggleTodo, deleteTodo, loading }: TodoListProps) {
    const filter = useFilterStore(s => s.filter);

    const message =
        filter === FilterType.ALL
            ? "Click the underneath button to create your first todo..."
            : `No ${filter === FilterType.ACTIVE ? "active" : "completed"} records.`;

    const divContent = (
        <li className="li-item">
            <span className="text-hint">{message}</span>
        </li>
    );

    return (
        <ul className="mb-3">
            {loading && (
                <li className="todo-list-loading">
                    <CircularProgress />
                </li>
            )}
            {!loading && todos.length === 0 && divContent}
            {!loading && todos.map(todo => (
                <TodoItem key={todo.todoId} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
            ))}
        </ul>
    );
}

export default TodoList;
