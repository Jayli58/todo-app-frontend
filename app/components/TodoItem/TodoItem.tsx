import {Todo} from "../../dataType/Todo";
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
    toggleTodo: (todoId: string) => void;
    deleteTodo: (id: number) => void;
}

function TodoItem({todo, toggleTodo, deleteTodo}: TodoItemProps) {

    const [open, setOpen] = useState(false);

    const tooltipMark = todo.statusCode === 'Incomplete' ? "Mark as completed" : "Mark as active";

    return (
        <li className="li-item">
            <Tooltip title={todo.content} arrow placement="auto">
                <span className={todo.statusCode === 'Complete' ? "text-linethrough" : "text-normal"}>
                    {todo.title}
                </span>
            </Tooltip>

            <div className="flex gap-2">
                <Tooltip title={tooltipMark} placement="top" arrow>
                    <button
                        onClick={() => toggleTodo(todo.todoId)}
                        className="btn-primary"
                    >
                        {todo.statusCode === 'Complete' ? <RotateLeftIcon/> : <DoneOutlineIcon/>}
                    </button>
                </Tooltip>

                {/*<button*/}
                {/*    command="show-modal" commandfor="time-picker-dialog"*/}
                {/*    className="btn-secondary"*/}
                {/*>*/}
                {/*    <AccessAlarmIcon/>*/}
                {/*</button>*/}
                {/*<TimePickerDialog/>*/}

                <Tooltip title="Set email notification" placement="top" arrow>
                    <button
                        onClick={() => setOpen(true)}
                        className="btn-secondary"
                    >
                        <AccessAlarmIcon />
                    </button>
                </Tooltip>
                <TimePickerDialog todo={todo} open={open} onClose={() => setOpen(false)} />

                <Tooltip title="Delete" placement="top" arrow>
                    <button
                        // onClick={() => deleteTodo(todo.id)}
                        command="show-modal" commandfor="deletion-dialog"
                        className="btn-danger"
                    >
                        <DeleteOutlinedIcon/>
                    </button>
                </Tooltip>
                <DeletionDialog todo={todo} deleteTodo={deleteTodo} />

            </div>
        </li>
    );
}

export default TodoItem;
