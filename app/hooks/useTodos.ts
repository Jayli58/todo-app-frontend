import { useEffect, useMemo, useRef, useState } from "react";
import { Todo } from "../dataType/Todo";
import { useFilterStore } from "../store/FilterStore";
import { FilterType } from "../dataType/FilterTypes";
import { useAuth } from "react-oidc-context";
import {
    createTodoApi,
    deleteTodoApi,
    fetchTodosApi,
    searchTodosApi,
    updateTodoStatusApi,
    UpsertReminder
} from "../shared/TodoService";
import { getApiError } from "../shared/api/api";
import { TodoFilterProps } from "../components/TodoFilter";
import { useIdentityStore } from "../store/IdentityStore";
import { SnackbarType } from "../shared/components/SharedSnackbar";
import { TODO_PAGE_LIMIT } from "../config/PaginationConfig";


export function useTodos(notify?: (type: SnackbarType, msg: string) => void) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [searchText, setSearchText] = useState<string>("");
    const limit = TODO_PAGE_LIMIT;
    // introduce requestId to prevent stale async response
    const requestIdRef = useRef(0);

    const nextRequestId = () => {
        requestIdRef.current += 1;
        return requestIdRef.current;
    };

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

    // Load todos from backend once user is authenticated
    useEffect(() => {
        // if (!auth.isAuthenticated || !auth.user) return;
        // console.log("auth?", auth.isAuthenticated, "token?", !!idToken);
        if (!idToken) return;
        const requestId = nextRequestId();

        fetchTodosApi(limit, null, "fetch")
            .then((result) => {
                if (requestId !== requestIdRef.current) return;
                setTodos(result.items);
                setNextToken(result.nextToken);
                setHasMore(result.nextToken !== null);
            })
            .catch(console.error)

    }, [auth.isAuthenticated, idToken]);

    const addTodo = async (title: string, content: string): Promise<boolean> => {
        if (title === "") {
            notify?.("error", "Todo title cannot be empty!");
            return false;
        }

        try {
            const newTodo = await createTodoApi(title, content);

            // Update local state with backend response
            setTodos(prev => [newTodo, ...prev]);
            // Show success snackbar
            notify?.("success", "Todo created successfully!");
            return true;
        } catch (e: any) {
            // Show error snackbar
            const { message } = getApiError(e);
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
                setTodos(prev => prev.filter(todo => todo.todoId !== todoId));
                // Show success snackbar
                notify?.("success", "Todo deleted successfully!");
            } else {
                // console.error("Backend returned false, deletion failed.");
                // Show error snackbar
                notify?.("error", "Failed to delete todo!");
            }
        } catch (e: any) {
            // Show error snackbar
            const { message } = getApiError(e);
            notify?.("error", "Failed to delete todo! " + message);
        }
    }

    const searchTodo = async (text: string) => {

        try {
            const trimmed = text.trim();
            setSearchText(trimmed);
            const requestId = nextRequestId();
            const result = await searchTodosApi(trimmed, limit, null);

            if (requestId !== requestIdRef.current) return;

            if (result.items.length === 0) {
                // console.error("No matching todos found.");
                // Show error snackbar
                notify?.("error", "No matching todos found.");
                return;
            }

            // Update local state with backend response
            setTodos(result.items);
            setNextToken(result.nextToken);
            setHasMore(result.nextToken !== null);

            // Show success snackbar
            notify?.("success", "Here are the searched results!");
        } catch (e: any) {
            const { message } = getApiError(e);
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
            setTodos(prev => prev.map(t =>
                t.todoId === todoId ? updated : t
            ));

            // Show success snackbar
            notify?.("success", "Successfully marked as " + newStatus);
        } catch (e: any) {
            const { message } = getApiError(e);
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
            setTodos(prev => prev.map(todo =>
                todo.todoId === todoId
                    ? { ...todo, remindTimestamp: timestamp }
                    : todo
            ));

            notify?.("success", "Reminder set successfully!");
            return true;
        } catch (e: any) {
            const { message } = getApiError(e);

            notify?.("error", "Failed to set reminder! " + message);
            return false;
        }
    };

    const loadMore = async () => {
        if (!hasMore) return;

        try {
            // if searchText is not empty, use searchTodosApi, otherwise use fetchTodosApi
            const requestId = nextRequestId();
            const result = searchText
                ? await searchTodosApi(searchText, limit, nextToken)
                : await fetchTodosApi(limit, nextToken, "loadMore");

            if (requestId !== requestIdRef.current) return;
            setTodos(prev => [...prev, ...result.items]);
            setNextToken(result.nextToken);
            setHasMore(result.nextToken !== null);
        } catch (e: any) {
            const { message } = getApiError(e);

            notify?.("error", "Failed to load more todos! " + message);
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
        loadMore,
        hasMore,
        badgeNums
    };
}
