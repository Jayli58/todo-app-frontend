import {Todo} from "../dataType/Todo";
import TodoItem from "./TodoItem/TodoItem";
import {useFilterStore} from "../store/FilterStore";
import {FilterType} from "../dataType/FilterTypes";

interface TodoListProps {
    todos: Todo[];
    toggleTodo: (todoId: string) => void;
    deleteTodo: (todoId: string) => void;
}

function TodoList({todos, toggleTodo, deleteTodo}: TodoListProps) {
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
            {todos.length === 0 && divContent}
            {todos.map(todo => (
                <TodoItem key={todo.todoId} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo}></TodoItem>
            ))}
        </ul>
    );
}

export default TodoList;
