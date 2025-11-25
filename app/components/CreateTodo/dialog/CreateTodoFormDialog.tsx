import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import PostAddIcon from '@mui/icons-material/PostAdd';

function CreateTodoFormDialog({open, onClose}) {
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

                                <p className="dialog-message">
                                    Fill your content...
                                </p>

                                <p className="dialog-todo-text mb-3">content</p>

                                <div className="mt-6">

                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="dialog-footer">
                        <button
                            // onClick={() => handleSave(selectedValue)}
                            className="dialog-btn-secondary"
                            type="button"
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
