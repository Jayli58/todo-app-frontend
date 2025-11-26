"use client";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import {useEffect, useState} from "react";
import {Todo} from "./types";
import {ReminderContext} from "./services/RemainderContext";
import CreateTodo from "./components/CreateTodo/CreateTodo";
import {useFilterStore} from "./services/FilterStore";
import {FilterType} from "./services/dataType/FilterTypes";
import SearchTodo from "./components/SearchTodo";


export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

    const filter = useFilterStore(s => s.filter);

    // update upon changes on todos or filter
    useEffect(() => {
        setFilteredTodos(todos);
    }, [todos, filter]);

    const addTodo = (text: string, content: string) => {
        const newTodo = {
            id: Date.now(),
            text: text,
            content: content,
            completed: false,
            remindTimestamp: null
        }
        setTodos([newTodo, ...todos]);
    }

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
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
                todo.text.toLowerCase().includes(lower) ||
                todo.content.toLowerCase().includes(lower)
            )
        );
    }

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                todo.completed = !todo.completed;
            }
            return todo;
        }))
    }

    const setReminder = (id: number, timestamp: number | null) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                todo.remindTimestamp = timestamp;
            }
            return todo;
        }))
    };

    const getFilteredTodos = () => {
        let list = [...filteredTodos];

        switch (filter) {
            case FilterType.COMPLETED:
                return list.filter(todo => todo.completed);
            case FilterType.ACTIVE:
                return list.filter(todo => !todo.completed);
            default:
                return list;
        }
    }

    return (
        <ReminderContext.Provider value={{ setReminder }}>
            <div className="max-w-xl mx-auto mt-10 rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/5">
                <h1 className="h1-tag">Todo List</h1>
                <SearchTodo searchTodo={searchTodo}></SearchTodo>
                <TodoList todos={getFilteredTodos()} deleteTodo={deleteTodo} toggleTodo={toggleTodo}></TodoList>
                <div className="flex justify-between">
                    <CreateTodo addTodo={addTodo}></CreateTodo>
                    <TodoFilter filter={filter}></TodoFilter>
                </div>
            </div>
        </ReminderContext.Provider>
    );
}
