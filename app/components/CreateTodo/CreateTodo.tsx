'use client';
import {useCallback, useState} from "react";
import CreateTodoFormDialog from "./dialog/CreateTodoFormDialog";
import { useDialogStore } from "../../store/DialogStore";

interface AddTodoProps {
    addTodo: (text: string, content: string) => Promise<boolean>;
}


function CreateTodo({ addTodo }: AddTodoProps) {
    const [open, setOpen] = useState(false);

    const setDialogOpen = useDialogStore((s) => s.setDialogOpen);

    // useCallback is used to prevent the component from re-rendering unnecessarily.
    const handleOpen = useCallback(() => {
        setOpen(true);
        setDialogOpen(true);
    }, [setDialogOpen]);

    const handleClose = useCallback(() => {
        setOpen(false);
        setDialogOpen(false);
    }, [setDialogOpen]);

    return (
        <div className="mt-4">
            <button
                onClick={handleOpen}
                className="btn-new-create"
            >
                Create todo
            </button>
            <CreateTodoFormDialog addTodo={addTodo} open={open} onClose={handleClose} />
        </div>
    );
}

export default CreateTodo;
