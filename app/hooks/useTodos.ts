import {useEffect, useState} from "react";
import {Todo} from "../dataType/Todo";
import {useFilterStore} from "../store/FilterStore";
import {FilterType} from "../dataType/FilterTypes";
import {useAuth} from "react-oidc-context";
import {fetchTodos, updateTodoStatus} from "../shared/TodoService";


export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

    const filter = useFilterStore(s => s.filter);
    const auth = useAuth();

    // Load todos from backend once user is authenticated
    useEffect(() => {
        if (!auth.isAuthenticated || !auth.user) return;

        fetchTodos()
            .then(setTodos)
            .catch(console.error);

    }, [auth.isAuthenticated]);

    // update upon changes on todos or filter
    useEffect(() => {
        setFilteredTodos(todos);
    }, [todos, filter]);

    const addTodo = (text: string, content: string) => {
        const newTodo = {
            todoId: '',
            title: text,
            content: content,
            statusCode: 'Incomplete',
            remindTimestamp: null
        }
        setTodos([newTodo, ...todos]);
    }

    const deleteTodo = (todoId: string) => {
        setTodos(todos.filter(todo => todo.todoId !== todoId));
    }

    const searchTodo = (text: string) => {
        if (!text.trim()) {
            // Reset search
            setFilteredTodos(todos);
            return;
        }

        const lower = text.toLowerCase();

        setFilteredTodos(
            todos.filter(todo =>
                todo.title.toLowerCase().includes(lower) ||
                todo.content.toLowerCase().includes(lower)
            )
        );
    }

    const toggleTodo = async (todoId: string) => {
        const existing = todos.find(t => t.todoId === todoId);
        if (!existing) return;

        const newStatus =
            existing.statusCode === "Complete" ? "Incomplete" : "Complete";

        try {
            // 1. Send update to backend
            const updated = await updateTodoStatus(todoId, newStatus);

            // 2. Update local state with backend response
            setTodos(todos.map(t =>
                t.todoId === todoId ? updated : t
            ));

        } catch (e) {
            console.error("Toggle failed:", e);
        }

        // setTodos(todos.map(todo => {
        //     if (todo.todoId === todoId) {
        //         todo.statusCode = todo.statusCode === 'Incomplete' ? 'Complete' : 'Incomplete';
        //     }
        //     return todo;
        // }))
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
