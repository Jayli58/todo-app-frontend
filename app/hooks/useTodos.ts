import {useEffect, useMemo, useState} from "react";
import {Todo} from "../dataType/Todo";
import {useFilterStore} from "../store/FilterStore";
import {FilterType} from "../dataType/FilterTypes";
import {useAuth} from "react-oidc-context";
import {
    createTodoApi,
    deleteTodoApi,
    fetchTodosApi,
    searchTodosApi,
    updateTodoStatusApi,
    UpsertReminder
} from "../shared/TodoService";
import {TodoFilterProps} from "../components/TodoFilter";
import {useIdentityStore} from "../store/IdentityStore";
import {SnackbarType} from "../shared/components/SharedSnackbar";


export function useTodos(notify?: (type: SnackbarType, msg: string) => void) {
    const [todos, setTodos] = useState<Todo[]>([]);

    const badgeNums: TodoFilterProps = useMemo(() => ({
        totalNum: todos.length,
        activeNum: todos.filter(t => t.statusCode === "Incomplete").length,
        completedNum: todos.filter(t => t.statusCode === "Complete").length,
    }), [todos]);

    const filter: FilterType = useFilterStore(s => s.filter);

    const filteredTodos = useMemo(() => {
        switch (filter) {
            case FilterType.ACTIVE:
                return todos.filter(t => t.statusCode === "Incomplete");
            case FilterType.COMPLETED:
                return todos.filter(t => t.statusCode === "Complete");
            default:
                return todos;
        }
    }, [todos, filter]);

    const auth = useAuth();

    const idToken = useIdentityStore(s => s.identity?.idToken);

    const [loading, setLoading] = useState(false);

    // Load todos from backend once user is authenticated
    useEffect(() => {
        // if (!auth.isAuthenticated || !auth.user) return;
        // console.log("auth?", auth.isAuthenticated, "token?", !!idToken);
        if (!idToken) return;

        setLoading(true);
        fetchTodosApi()
            .then((result: Todo[]) => {
                setTodos(result);
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false);
            });

    }, [auth.isAuthenticated, idToken]);

    const addTodo = async (title: string, content: string): Promise<boolean> => {
        if (title === "") {
            notify?.("error", "Todo title cannot be empty!");
            return false;
        }

        try {
            const newTodo = await createTodoApi(title, content);

            // Update local state with backend response
            setTodos([newTodo, ...todos]);
            // Show success snackbar
            notify?.("success", "Todo created successfully!");
            return true;
        } catch (e: any) {
            // Show error snackbar
            const message =
                e.response?.data?.title ||   // backend-defined message
                e.response?.data?.message || // common alternative
                e.message ||                 // Axios / JS error
                "Unknown error";
            notify?.("error", "Failed to create todo! " + message);
            return false;
        }
    }

    const deleteTodo = async (todoId: string) => {
        try {
            // 1. Send deletion to backend
            const success = await deleteTodoApi(todoId);

            // 2. Update local state with backend response
            if (success) {
                setTodos(todos.filter(todo => todo.todoId !== todoId));
                // Show success snackbar
                notify?.("success", "Todo deleted successfully!");
            } else {
                // console.error("Backend returned false, deletion failed.");
                // Show error snackbar
                notify?.("error", "Failed to delete todo!");
            }
        } catch (e: any) {
            // Show error snackbar
            const message =
                e.response?.data?.title ||   // backend-defined message
                e.response?.data?.message || // common alternative
                e.message ||                 // Axios / JS error
                "Unknown error";
            notify?.("error", "Failed to delete todo! " + message);
        }
    }

    const searchTodo = async (text: string) => {

        try {
            const searchedTodos = await searchTodosApi(text);

            if (searchedTodos.length === 0) {
                // console.error("No matching todos found.");
                // Show error snackbar
                notify?.("error", "No matching todos found.");
                return;
            }

            // Update local state with backend response
            setTodos(searchedTodos);

            // Show success snackbar
            notify?.("success", "Here are the searched results!");
        } catch (e: any) {
            // Show error snackbar
            const message =
                e.response?.data?.title ||   // backend-defined message
                e.response?.data?.message || // common alternative
                e.message ||                 // Axios / JS error
                "Unknown error";
            notify?.("error", "Search failed! " + message);
        }
    }

    const toggleTodo = async (todoId: string) => {
        const existing = todos.find(t => t.todoId === todoId);
        if (!existing) return;

        const newStatus =
            existing.statusCode === "Complete" ? "Incomplete" : "Complete";

        try {
            // 1. Send update to backend
            const updated = await updateTodoStatusApi(todoId, newStatus);

            // 2. Update local state with backend response
            setTodos(todos.map(t =>
                t.todoId === todoId ? updated : t
            ));

            // Show success snackbar
            notify?.("success", "Successfully marked as " + newStatus);
        } catch (e: any) {
            // Show error snackbar
            const message =
                e.response?.data?.title ||   // backend-defined message
                e.response?.data?.message || // common alternative
                e.message ||                 // Axios / JS error
                "Unknown error";

            notify?.("error", "Toggle failed! " + message);
        }
    }

    const setReminder = async (todoId: string, timestamp: number | null): Promise<boolean> => {
        if (timestamp === null) {
            notify?.("error", "Reminder time is required!");
            return false;
        }

        try {
            // call backend api
            await UpsertReminder(todoId, timestamp);

            // update react state
            setTodos(todos.map(todo => {
                if (todo.todoId === todoId) {
                    todo.remindTimestamp = timestamp;
                }
                return todo;
            }))

            notify?.("success", "Reminder set successfully!");
            return true;
        } catch (e: any) {
            const message =
                e.response?.data?.title ||   // backend-defined message
                e.response?.data?.message || // common alternative
                e.message ||                 // Axios / JS error
                "Unknown error";

            notify?.("error", "Failed to set reminder! " + message);
            return false;
        }
    };

    return {
        todos,
        filteredTodos,
        addTodo,
        deleteTodo,
        toggleTodo,
        setReminder,
        searchTodo,
        badgeNums,
        loading
    };
}
