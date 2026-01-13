import {useEffect, useState} from "react";
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


export function useTodos(notify?: (type: "success" | "error", msg: string) => void) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
    const [badgeNums, setBadgeNums] = useState<TodoFilterProps>({
        totalNum: 0,
        activeNum: 0,
        completedNum: 0
    });

    const filter = useFilterStore(s => s.filter);
    const auth = useAuth();

    const idToken = useIdentityStore(s => s.identity?.idToken);

    // Load todos from backend once user is authenticated
    useEffect(() => {
        // if (!auth.isAuthenticated || !auth.user) return;
        // console.log("auth?", auth.isAuthenticated, "token?", !!idToken);
        if (!idToken) return;

        fetchTodosApi()
            .then(setTodos)
            .catch(console.error);

    }, [auth.isAuthenticated, idToken]);

    // update upon changes on todos or filter
    useEffect(() => {
        setFilteredTodos(todos);
    }, [todos, filter]);

    // badge num for filter btn
    useEffect(() => {
        const total = todos.length;
        const active = todos.filter(t => t.statusCode === "Incomplete").length;
        const completed = todos.filter(t => t.statusCode === "Complete").length;

        setBadgeNums({
            totalNum: total,
            activeNum: active,
            completedNum: completed,
        });
    }, [todos]);

    const addTodo = async (title: string, content: string) => {
        try {
            const newTodo = await createTodoApi(title, content);

            // Update local state with backend response
            setTodos([newTodo, ...todos]);
            // Show success snackbar
            notify?.("success", "Todo created successfully!");
        } catch (e: any) {
            console.error("Creation failed:", e);
            // Show error snackbar
            notify?.("error", "Failed to create todo! " + e.message);
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
            // console.error("Deletion failed:", e);
            // Show error snackbar
            notify?.("error", "Failed to create todo! " + e.message);
        }
    }

    const searchTodo = async (text: string) => {

        const lower = text.toLowerCase();

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

            setFilteredTodos(
                todos.filter(todo =>
                    todo.title.toLowerCase().includes(lower) ||
                    todo.content.toLowerCase().includes(lower)
                )
            );

            // Show success snackbar
            notify?.("success", "Here are the searched results!");
        } catch (e: any) {
            // console.error("Search failed:", e);
            // Show error snackbar
            notify?.("error", "Search failed! " + e.message);
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
            // console.error("Toggle failed:", e);
            // Show error snackbar
            notify?.("error", "Toggle failed! " + e.message);
        }
    }

    const setReminder = async (todoId: string, timestamp: number | null) => {
        if (timestamp === null) return;

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

        } catch (e: any) {
            const message =
                e.response?.data ||              // backend text body
                e.response?.data?.message ||
                e.message ||
                "Unknown error";

            notify?.("error", "Failed to set reminder! " + message);
        }
    };

    const getFilteredTodos = () => {
        let list = [...filteredTodos];

        switch (filter) {
            case FilterType.COMPLETED:
                return list.filter(todo => todo.statusCode === 'Complete');
            case FilterType.ACTIVE:
                return list.filter(todo => todo.statusCode === 'Incomplete');
            default:
                return list;
        }
    }

    return {
        todos,
        filteredTodos: getFilteredTodos(),
        addTodo,
        deleteTodo,
        toggleTodo,
        setReminder,
        searchTodo,
        badgeNums
    };
}
