import { Todo } from "../../../dataType/Todo";

interface DeletionDialogProps {
    todo: Todo;
    open: boolean;
    onClose: () => void;
    deleteTodo: (todoId: string) => void;
}

function DeletionDialog({ todo, open, onClose, deleteTodo }: DeletionDialogProps) {

    return (
        <dialog open={open} onClose={onClose} id="deletion-dialog" aria-labelledby="dialog-title" className="dialog-wrapper">
            <div className="dialog-backdrop" />

            <div tabIndex={0} className="dialog-container-top">
                <div className="dialog-panel">
                    <div className="px-6 py-4">
                        <div className="sm:flex sm:items-start">
                            <div className="dialog-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    aria-hidden="true"
                                    className="size-6 text-red-600"
                                >
                                    <path
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217
                      3.374 1.948 3.374h14.71c1.73 0
                      2.813-1.874 1.948-3.374L13.949
                      3.378c-.866-1.5-3.032-1.5-3.898
                      0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <div className="dialog-text-info">
                                <h3 id="dialog-title" className="dialog-title">
                                    Delete record
                                </h3>

                                <p className="dialog-message">
                                    Are you sure you want to delete this? This action cannot be undone.
                                </p>

                                {/*<p className="dialog-todo-text">{todo.title}</p>*/}

                                <p className="dialog-todo-text">
                                    <span className="inline-block w-20">Title:</span>
                                    {todo.title}
                                </p>

                                <p className="dialog-todo-text mb-1">
                                    <span className="inline-block w-20">Content:</span>
                                    {todo.content}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="dialog-footer">
                        <button
                            onClick={() => deleteTodo(todo.todoId)}
                            className="dialog-btn-danger"
                            type="button"
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => onClose()}
                            type="button"
                            className="dialog-btn-cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default DeletionDialog;
