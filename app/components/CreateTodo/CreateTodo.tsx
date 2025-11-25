'use client';
import {useState} from "react";
import CreateTodoFormDialog from "./dialog/CreateTodoFormDialog";

interface AddTodoProps {
    addTodo: (text: string) => void;
}


function CreateTodo({addTodo}: AddTodoProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="mt-4">
            <button
                onClick={() => setOpen(true)}
                className="btn-new-create"
            >
                Create todo
            </button>
            <CreateTodoFormDialog addTodo={addTodo} open={open} onClose={() => setOpen(false)} />

        </div>
    );
}

export default CreateTodo;
