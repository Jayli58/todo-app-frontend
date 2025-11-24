import {Todo} from "../types";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

interface TodoItemProps {
    todo: Todo;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

function TodoItem({todo, toggleTodo, deleteTodo}: TodoItemProps) {
    return (
        <li className="li-item">
            <span className={todo.completed ? "text-linethrough" : "text-normal"}>
                {todo.text}
            </span>

            <div className="flex gap-2">
                <button
                    onClick={() => toggleTodo(todo.id)}
                    className="btn-primary"
                >
                    {todo.completed ? <RotateLeftIcon /> : <DoneOutlineIcon />}
                </button>

                <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn-danger"
                >
                    <DeleteOutlinedIcon/>
                </button>
            </div>
        </li>

    );
}

export default TodoItem;
