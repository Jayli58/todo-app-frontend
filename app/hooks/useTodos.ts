import {useEffect, useState} from "react";
import {Todo} from "../dataType/Todo";
import {useFilterStore} from "../store/FilterStore";
import {FilterType} from "../dataType/FilterTypes";
import {useAuth} from "react-oidc-context";
import {createTodoApi, deleteTodoApi, fetchTodosApi, searchTodosApi, updateTodoStatusApi} from "../shared/TodoService";


export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

    const filter = useFilterStore(s => s.filter);
    const auth = useAuth();

    // Load todos from backend once user is authenticated
    useEffect(() => {
        if (!auth.isAuthenticated || !auth.user) return;

        fetchTodosApi()
            .then(setTodos)
            .catch(console.error);

    }, [auth.isAuthenticated]);

    // update upon changes on todos or filter
    useEffect(() => {
        setFilteredTodos(todos);
    }, [todos, filter]);

    const addTodo = async (title: string, content: string) => {
        try {
            const newTodo = await createTodoApi(title, content);

            // Update local state with backend response
            setTodos([newTodo, ...todos]);
        } catch (e) {
            // todo: pop up window for error
            console.error("Creation failed:", e);
        }
    }

    const deleteTodo = async (todoId: string) => {
        try {
            // 1. Send deletion to backend
            const success = await deleteTodoApi(todoId);

            // 2. Update local state with backend response
            if (success) {
                setTodos(todos.filter(todo => todo.todoId !== todoId));
            } else {
                console.error("Backend returned false, deletion failed.");
            }

        } catch (e) {
            // todo: pop up window for deletion success or failure
            console.error("Deletion failed:", e);
        }
    }

    const searchTodo = async (text: string) => {
        // if (!text.trim()) {
        //     // Reset search
        //     setFilteredTodos(todos);
        //     return;
        // }

        const lower = text.toLowerCase();

        try {
            const searchedTodos = await searchTodosApi(text);

            if (searchedTodos.length === 0) {
                console.error("No matching todos found.");
            }

            // Update local state with backend response
            setTodos(searchedTodos);

            setFilteredTodos(
                todos.filter(todo =>
                    todo.title.toLowerCase().includes(lower) ||
                    todo.content.toLowerCase().includes(lower)
                )
            );
        } catch (e) {
            // todo: pop up window for error
            console.error("Search failed:", e);
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

        } catch (e) {
            // todo: pop up window for error
            console.error("Toggle failed:", e);
        }
    }

    const setReminder = (todoId: string, timestamp: number | null) => {
        setTodos(todos.map(todo => {
            if (todo.todoId === todoId) {
                todo.remindTimestamp = timestamp;
            }
            return todo;
        }))
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
        searchTodo
    };
}
