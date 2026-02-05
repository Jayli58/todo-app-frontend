import { Todo } from "../dataType/Todo";
import TodoItem from "./TodoItem/TodoItem";
import { useFilterStore } from "../store/FilterStore";
import { FilterType } from "../dataType/FilterTypes";
import { Button, CircularProgress } from "@mui/material";

interface TodoListProps {
    todos: Todo[];
    toggleTodo: (todoId: string) => void;
    deleteTodo: (todoId: string) => void;
    loading: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loadingMore?: boolean;
}

function TodoList({
    todos,
    toggleTodo,
    deleteTodo,
    loading,
    onLoadMore,
    hasMore,
    loadingMore
}: TodoListProps) {
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
        <>
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
            {!loading && hasMore && onLoadMore && (
                <div className="todo-list-center">
                    <button
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className="btn-load-more"
                    >
                        {loadingMore ? "Loading..." : "Load more"}
                    </button>                    
                </div>
            )}
            {!loading && !hasMore && todos.length > 0 && (
                <div className="todo-list-center">
                    <span className="text-muted-italic">No more records...</span>
                </div>
            )}
        </>
    );
}

export default TodoList;
