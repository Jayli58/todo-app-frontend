"use client"
import AddTodo from "./components/AddTodo";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import {useState} from "react";
import {Todo} from "./types";


export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState('all');

    const addTodo = (text: string) => {
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
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

    const getFilteredTodos = () => {
        switch (filter) {
            case 'completed':
                return todos.filter(todo => todo.completed);
            case 'active':
                return todos.filter(todo => !todo.completed);
            default:
                return todos;
        }
    }


    return (
        <div className="max-w-xl mx-auto mt-10 rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/5">
            <h1 className="h1-tag">TodoList</h1>
            <AddTodo addTodo={addTodo}></AddTodo>
            <TodoList todos={getFilteredTodos()} deleteTodo={deleteTodo} toggleTodo={toggleTodo}></TodoList>
            <TodoFilter filter={filter} setFilter={setFilter}></TodoFilter>
        </div>
    );
}
