'use client';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {useEffect, useState} from "react";
import {TextField} from "@mui/material";

interface CreateTodoFormProps {
    addTodo: (text: string, content: string) => Promise<boolean>;
    open: boolean;
    onClose: () => void;
}

function CreateTodoFormDialog({addTodo, open, onClose}: CreateTodoFormProps) {
    const TITLE_MAX = 100;
    const CONTENT_MAX = 200;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [titleTouched, setTitleTouched] = useState(false);
    const [titleBlurred, setTitleBlurred] = useState(false);

    // ESC key closes the dialog
    useEffect(() => {
        if (!open) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handler);
        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, [open, onClose]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const todoText = `${title}`.trim();
        const todoContent = `${content}`.trim();
        // if (todoText === "") return;
        const success = await addTodo(todoText, todoContent);

        // keep dialog open, keep inputs
        if (!success) return;

        // reset
        setTitle("");
        setContent("");
        setTitleTouched(false);
        setTitleBlurred(false);

        // close dialog
        onClose();
    }

    return (
        <dialog open={open} onClose={onClose} aria-labelledby="dialog-title" className="dialog-wrapper">
            <div className="dialog-backdrop" />

            <div tabIndex={0} className="dialog-container-top">
                <div className="dialog-panel">
                    <div className="px-6 pt-4">
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

                            <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 id="dialog-title" className="dialog-title">
                                    Create a new todo
                                </h3>

                                <p className="dialog-message mb-5">
                                    {/*Fill your content underneath*/}
                                </p>

                                <div className="dialog-todo-text mb-3">
                                    <form
                                        id="todoForm"
                                        onSubmit={handleSubmit}
                                        className="flex flex-col gap-3 mb-6"
                                    >
                                        {/*onFocus, onBlur -- soft control for the form*/}
                                        <TextField
                                            id="todo-title"
                                            label="Title"
                                            variant="outlined"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            fullWidth
                                            onFocus={() => setTitleTouched(true)}
                                            onBlur={() => setTitleBlurred(true)}
                                            error={titleTouched && titleBlurred && title.trim().length === 0}
                                            slotProps={{ htmlInput: {maxLength: TITLE_MAX} }}
                                            helperText={
                                                titleTouched && titleBlurred && title.trim().length === 0
                                                    ? "Title is required"
                                                    : title.length === 0
                                                    ? `Up to ${TITLE_MAX} characters`
                                                    : `${title.length} / ${TITLE_MAX} characters`
                                            }
                                        />
                                        <TextField
                                            id="todo-content"
                                            label="Content"
                                            multiline
                                            rows={4}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            fullWidth
                                            slotProps={{ htmlInput: {maxLength: CONTENT_MAX} }}
                                            helperText={
                                                content.length === 0
                                                    ? `Up to ${CONTENT_MAX} characters`
                                                    : `${content.length} / ${CONTENT_MAX} characters`
                                            }
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
                </div>
            </div>
        </dialog>
    );
}

export default CreateTodoFormDialog;
