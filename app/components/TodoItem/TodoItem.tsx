import { Todo } from "../../dataType/Todo";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import DeletionDialog from "./dialog/DeletionDialog";
import TimePickerDialog from "./dialog/TimePickerDialog";
import { useEffect, useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import { useDialogStore } from "../../store/DialogStore";
import { useLoadingStore } from "../../store/LoadingStore";

interface TodoItemProps {
    todo: Todo;
    toggleTodo: (todoId: string) => void;
    deleteTodo: (todoId: string) => void;
}

function TodoItem({ todo, toggleTodo, deleteTodo }: TodoItemProps) {

    const [reminderOpen, setReminderOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const setDialogOpen = useDialogStore((s) => s.setDialogOpen);

    // Subscribe to loading states for this specific todo
    const isToggling = useLoadingStore((s) => s.loadingActions.has(`toggle:${todo.todoId}`));
    const isDeleting = useLoadingStore((s) => s.loadingActions.has(`delete:${todo.todoId}`));
    const isSettingReminder = useLoadingStore((s) => s.loadingActions.has(`reminder:${todo.todoId}`));

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

    useEffect(() => {
        // Cleanup: if this item unmounts (e.g. deleted) while a dialog is open,
        // ensure global dialogOpen doesn't stay stuck true.
        return () => setDialogOpen(false);
    }, [setDialogOpen]);

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
                    <span>
                        <button
                            onClick={() => toggleTodo(todo.todoId)}
                            className="btn-primary"
                            disabled={isToggling}
                        >
                            {todo.statusCode === 'Complete' ? <RotateLeftIcon /> : <DoneOutlineIcon />}
                        </button>
                    </span>
                </Tooltip>

                {/*<button*/}
                {/*    command="show-modal" commandfor="time-picker-dialog"*/}
                {/*    className="btn-secondary"*/}
                {/*>*/}
                {/*    <AccessAlarmIcon/>*/}
                {/*</button>*/}
                {/*<TimePickerDialog/>*/}

                <Tooltip title="Set email notification" placement="top" arrow>
                    <span>
                        <button
                            onClick={handleOpenReminder}
                            className="btn-secondary"
                            disabled={isSettingReminder}
                        >
                            <AccessAlarmIcon />
                        </button>
                    </span>
                </Tooltip>
                <TimePickerDialog todo={todo} open={reminderOpen} onClose={handleCloseReminder} />

                <Tooltip title="Delete" placement="top" arrow>
                    <span>
                        <button
                            onClick={handleOpenDelete}
                            className="btn-danger"
                            disabled={isDeleting}
                        >
                            <DeleteOutlinedIcon />
                        </button>
                    </span>
                </Tooltip>
                <DeletionDialog todo={todo} open={deleteOpen} onClose={handleCloseDelete} deleteTodo={deleteTodo} />

            </div>
        </li>
    );
}

export default TodoItem;
