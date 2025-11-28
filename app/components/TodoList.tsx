import {Todo} from "../daataType/Todo";
import TodoItem from "./TodoItem/TodoItem";
import {useFilterStore} from "../services/FilterStore";
import {FilterType} from "../services/dataType/FilterTypes";

interface TodoListProps {
    todos: Todo[];
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
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
        <ul>
            {todos.length === 0 && divContent}
            {todos.map(todo => (
                <TodoItem key={todo.todoId} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo}></TodoItem>
            ))}
        </ul>
    );
}

export default TodoList;
