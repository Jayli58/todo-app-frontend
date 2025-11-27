"use client";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import {ReminderContext} from "./services/RemainderContext";
import CreateTodo from "./components/CreateTodo/CreateTodo";
import SearchTodo from "./components/SearchTodo";
import {useIdentityStore} from "./services/IdentityStore";
import {useTodos} from "./hooks/useTodos";


export default function Home() {
    // get auth info
    const identity = useIdentityStore(i => i.identity);

    // trigger todo hooks
    const {
        filteredTodos,
        addTodo,
        deleteTodo,
        toggleTodo,
        setReminder,
        searchTodo
    } = useTodos();

    return (
        <ReminderContext.Provider value={{ setReminder }}>
            <div className="max-w-xl mx-auto mt-10 rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/5">
                <h1 className="h1-tag">Todo List for {identity?.name ?? "Guest"}</h1>
                <SearchTodo searchTodo={searchTodo}></SearchTodo>
                <TodoList todos={filteredTodos} deleteTodo={deleteTodo} toggleTodo={toggleTodo}></TodoList>
                <div className="flex justify-between">
                    <CreateTodo addTodo={addTodo}></CreateTodo>
                    <TodoFilter />
                </div>
            </div>
        </ReminderContext.Provider>
    );
}
