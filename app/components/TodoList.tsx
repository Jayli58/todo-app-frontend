import {Todo} from "../types";
import TodoItem from "./TodoItem/TodoItem";

interface TodoListProps {
    todos: Todo[];
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

function TodoList({todos, toggleTodo, deleteTodo}: TodoListProps) {
    let divContent = (
        <li className="li-item">
            <span className="text-hint">
                Click the underneath button to create your first todo...
            </span>
        </li>
    );

    return (
        <ul>
            {todos.length === 0 && divContent}
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo}></TodoItem>
            ))}
        </ul>
    );
}

export default TodoList;
