import {Todo} from "../types";

interface TodoItemProps {
    todo: Todo;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

function TodoItem({todo, toggleTodo, deleteTodo}: TodoItemProps) {
    return (
        <li style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>
            {todo.text}
            <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
    );
}

export default TodoItem;
