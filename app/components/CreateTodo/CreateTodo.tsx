'use client';
import {useState} from "react";
import CreateTodoFormDialog from "./dialog/CreateTodoFormDialog";
import {useDialogStore} from "../../store/dialogStore";

interface AddTodoProps {
    addTodo: (text: string, content: string) => void;
}


function CreateTodo({addTodo}: AddTodoProps) {
    const [open, setOpen] = useState(false);

    const setDialogOpen = useDialogStore((s) => s.setDialogOpen);

    const handleOpen = () => {
        setOpen(true);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDialogOpen(false);
    };

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
