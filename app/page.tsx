"use client";
import AddTodo from "./components/AddTodo";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import {useState} from "react";
import {Todo} from "./types";
import {ReminderContext} from "./services/RemainderContext";
import CreateTodo from "./components/CreateTodo/CreateTodo";
import {useFilterStore} from "./services/FilterStore";
import {FilterType} from "./services/dataType/FilterTypes";


export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);

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

    const filter = useFilterStore(s => s.filter);

    const getFilteredTodos = () => {
        switch (filter) {
            case FilterType.COMPLETED:
                return todos.filter(todo => todo.completed);
            case FilterType.ACTIVE:
                return todos.filter(todo => !todo.completed);
            default:
                return todos;
        }
    }


    return (
        <ReminderContext.Provider value={{ setReminder }}>
            <div className="max-w-xl mx-auto mt-10 rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/5">
                <h1 className="h1-tag">Todo List</h1>
                <AddTodo addTodo={addTodo}></AddTodo>
                <TodoList todos={getFilteredTodos()} deleteTodo={deleteTodo} toggleTodo={toggleTodo}></TodoList>
                <div className="flex justify-between">
                    <CreateTodo addTodo={addTodo}></CreateTodo>
                    <TodoFilter filter={filter}></TodoFilter>
                </div>
            </div>
        </ReminderContext.Provider>
    );
}
