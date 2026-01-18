import {Todo} from "../../dataType/Todo";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import DeletionDialog from "./dialog/DeletionDialog";
import TimePickerDialog from "./dialog/TimePickerDialog";
import {useState} from "react";
import Tooltip from '@mui/material/Tooltip';
import {useDialogStore} from "../../store/dialogStore";

interface TodoItemProps {
    todo: Todo;
    toggleTodo: (todoId: string) => void;
    deleteTodo: (todoId: string) => void;
}

function TodoItem({todo, toggleTodo, deleteTodo}: TodoItemProps) {

    const [reminderOpen, setReminderOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const setDialogOpen = useDialogStore((s) => s.setDialogOpen);

    const handleOpenDelete = () => {
        setDeleteOpen(true);
        setDialogOpen(true);
    };

    const handleCloseDelete = () => {
        setDeleteOpen(false);
        setDialogOpen(false);
    };

    const handleOpenReminder = () => {
        setReminderOpen(true);
        setDialogOpen(true);
    };

    const handleCloseReminder = () => {
        setReminderOpen(false);
        setDialogOpen(false);
    };

    const tooltipMark = todo.statusCode === 'Incomplete' ? "Mark as completed" : "Mark as active";

    return (
        <li className="li-item">
            {/*setting (enterTouchDelay, leaveTouchDelay) for mobile; single tap would show tooltip; gone in 1.5 sec*/}
            <Tooltip
                title={todo.content}
                arrow
                placement="auto"
                enterTouchDelay={0}
                leaveTouchDelay={1500}
            >
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
                        onClick={handleOpenReminder}
                        className="btn-secondary"
                    >
                        <AccessAlarmIcon />
                    </button>
                </Tooltip>
                <TimePickerDialog todo={todo} open={reminderOpen} onClose={handleCloseReminder} />

                <Tooltip title="Delete" placement="top" arrow>
                    <button
                        onClick={handleOpenDelete}
                        className="btn-danger"
                    >
                        <DeleteOutlinedIcon/>
                    </button>
                </Tooltip>
                <DeletionDialog todo={todo} open={deleteOpen} onClose={handleCloseDelete} deleteTodo={deleteTodo} />

            </div>
        </li>
    );
}

export default TodoItem;
