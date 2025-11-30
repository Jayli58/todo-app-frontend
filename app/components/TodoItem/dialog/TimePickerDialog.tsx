import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Todo} from "../../../dataType/Todo";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import {useEffect, useState} from "react";
import {useReminder} from "../../../context/ReminderContext";
import dayjs from 'dayjs';
import {MobileDateTimePicker} from "@mui/x-date-pickers";


interface TimePickerDialogProps {
    todo: Todo;
    open: boolean;
    onClose: () => void;
}

function TimePickerDialog({todo, open, onClose}: TimePickerDialogProps) {
    const { setReminder } = useReminder();

    const handleSave = (value: number | null) => {
        setReminder(todo.todoId, value);
        onClose();
    };

    const [selectedValue, setSelectedValue] = useState<number | null>(null);

    useEffect(() => {
        if (open) {
            setSelectedValue(todo.remindTimestamp);
            // console.log("todo.remindTimestamp: ", todo.remindTimestamp);
        }
    }, [open, todo.remindTimestamp]);

    // ESC key closes the dialog
    useEffect(() => {
        if (!open) return;

        const handler = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handler);
        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, [open, onClose]);

    return (
        <dialog open={open} onClose={onClose} aria-labelledby="dialog-title" className="dialog-wrapper">
            <el-dialog-backdrop className="dialog-backdrop" />

            <div tabIndex={0} className="dialog-container-top">
                <el-dialog-panel className="dialog-panel">
                    <div className="px-6 py-4">
                        <div className="sm:flex sm:items-start">
                            <div className="dialog-icon-blue">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    // stroke="currentColor"
                                    // strokeWidth="1.5"
                                    aria-hidden="true"
                                    className="size-6 text-blue-600"
                                >
                                    <AccessAlarmIcon />
                                </svg>
                            </div>

                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 id="dialog-title" className="dialog-title">
                                    {todo.remindTimestamp === null ? "Set up a reminder" : "Modify the reminder"}
                                </h3>

                                <p className="dialog-message">
                                    An email will be sent upon the set time.
                                </p>

                                <p className="dialog-todo-text mb-1">
                                    <span className="inline-block w-20">Title:</span>
                                    {todo.title}
                                </p>

                                <p className="dialog-todo-text mb-1">
                                    <span className="inline-block w-20">Content:</span>
                                    {todo.content}
                                </p>

                                <div className="mt-6">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <MobileDateTimePicker
                                            label="Reminder time"
                                            // selectedValue in seconds; dayjs in milli-seconds
                                            value={selectedValue ? dayjs(selectedValue * 1000) : null}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    setSelectedValue(newValue.unix()); // seconds
                                                } else {
                                                    setSelectedValue(null);
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="dialog-footer">
                        <button
                            onClick={() => handleSave(selectedValue)}
                            className="dialog-btn-secondary"
                            type="button"
                        >
                            {todo.remindTimestamp === null ? "Set" : "Reset"}
                        </button>

                        <button
                            onClick={() => onClose()}
                            type="button"
                            className="dialog-btn-cancel"
                        >
                            Close
                        </button>
                    </div>
                </el-dialog-panel>
            </div>
        </dialog>
    );
}

export default TimePickerDialog;
