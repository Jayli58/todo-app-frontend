import {Todo} from "../../types";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import DeletionDialog from "./dialog/DeletionDialog";
import TimePickerDialog from "./dialog/TimePickerDialog";
import {useState} from "react";
import Tooltip from '@mui/material/Tooltip';

interface TodoItemProps {
    todo: Todo;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}

function TodoItem({todo, toggleTodo, deleteTodo}: TodoItemProps) {

    const [open, setOpen] = useState(false);

    return (
        <li className="li-item">
            <Tooltip title={todo.content} arrow placement="auto">
                <span className={todo.completed ? "text-linethrough" : "text-normal"}>
                    {todo.text}
                </span>
            </Tooltip>

            <div className="flex gap-2">
                <button
                    onClick={() => toggleTodo(todo.id)}
                    className="btn-primary"
                >
                    {todo.completed ? <RotateLeftIcon/> : <DoneOutlineIcon/>}
                </button>

                {/*<button*/}
                {/*    command="show-modal" commandfor="time-picker-dialog"*/}
                {/*    className="btn-secondary"*/}
                {/*>*/}
                {/*    <AccessAlarmIcon/>*/}
                {/*</button>*/}
                {/*<TimePickerDialog/>*/}

                <button
                    onClick={() => setOpen(true)}
                    className="btn-secondary"
                >
                    <AccessAlarmIcon />
                </button>
                <TimePickerDialog todo={todo} open={open} onClose={() => setOpen(false)} />

                <button
                    // onClick={() => deleteTodo(todo.id)}
                    command="show-modal" commandfor="deletion-dialog"
                    className="btn-danger"
                >
                    <DeleteOutlinedIcon/>
                </button>
                <DeletionDialog todo={todo} deleteTodo={deleteTodo} />

            </div>
        </li>
    );
}

export default TodoItem;
