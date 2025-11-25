'use client';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {useState} from "react";
import {TextField} from "@mui/material";

interface CreateTodoFormProps {
    addTodo: (text: string) => void;
    open: boolean;
    onClose: () => void;
}

function CreateTodoFormDialog({addTodo, open, onClose}: CreateTodoFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const todoText = `${title}`.trim();
        if (todoText === "") return;
        addTodo(todoText);

        // reset
        setTitle("");
        setContent("");

        // close dialog
        onClose();
    }

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
                                    <PostAddIcon />
                                </svg>
                            </div>

                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 id="dialog-title" className="dialog-title">
                                    Create a new todo
                                </h3>

                                <p className="dialog-message mb-5">
                                    {/*Fill your content underneath*/}
                                </p>

                                <div className="dialog-todo-text mb-3">
                                    <form id="todoForm" onSubmit={handleSubmit} className="flex flex-col items-center gap-3 mb-6">
                                        <TextField
                                            id="todo-title"
                                            label="Title"
                                            variant="outlined"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                        <TextField
                                            id="todo-content"
                                            label="Content"
                                            multiline
                                            rows={4}
                                            value={content}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                        {/*<Textarea*/}
                                        {/*    className="mt-1"*/}
                                        {/*    placeholder="Input content here!"*/}
                                        {/*    required*/}
                                        {/*    sx={{ mb: 1 }}*/}
                                        {/*    value={text}*/}
                                        {/*    onChange={(e) => setText(e.target.value)}*/}
                                        {/*/>*/}
                                    </form>
                                </div>

                                <div className="mt-6">

                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="dialog-footer">
                        <button
                            type="submit"
                            form="todoForm"
                            className="dialog-btn-secondary"
                        >
                            Create
                        </button>

                        <button
                            onClick={() => onClose()}
                            type="button"
                            className="dialog-btn-cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </el-dialog-panel>
            </div>
        </dialog>
    );
}

export default CreateTodoFormDialog;
