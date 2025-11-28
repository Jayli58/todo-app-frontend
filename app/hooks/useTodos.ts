import {useEffect, useState} from "react";
import {Todo} from "../dataType/Todo";
import {useFilterStore} from "../store/FilterStore";
import {FilterType} from "../dataType/FilterTypes";
import {useAuth} from "react-oidc-context";
import {fetchTodos, newFetchTodos} from "../components/shared/TodoService";


export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

    const filter = useFilterStore(s => s.filter);
    const auth = useAuth();

    // Load todos from backend once user is authenticated
    useEffect(() => {
        if (!auth.isAuthenticated || !auth.user) return;

        const token = auth.user.id_token;

        if (token != null) {
            newFetchTodos()
                .then((res: any) => {
                    // console.log(res);
                    return setTodos(res);
                })
                .catch(console.error);
        }

    }, [auth.isAuthenticated, auth.user]);  // runs when login finishes

    // update upon changes on todos or filter
    useEffect(() => {
        setFilteredTodos(todos);
    }, [todos, filter]);

    const addTodo = (text: string, content: string) => {
        const newTodo = {
            todoId: Date.now(),
            title: text,
            content: content,
            statusCode: 'Incomplete',
            remindTimestamp: null
        }
        setTodos([newTodo, ...todos]);
    }

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.todoId !== id));
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

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => {
            if (todo.todoId === id) {
                todo.statusCode = 'Incomplete';
            }
            return todo;
        }))
    }

    const setReminder = (id: number, timestamp: number | null) => {
        setTodos(todos.map(todo => {
            if (todo.todoId === id) {
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
