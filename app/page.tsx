"use client";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import {ReminderContext} from "./context/RemainderContext";
import CreateTodo from "./components/CreateTodo/CreateTodo";
import SearchTodo from "./components/SearchTodo";
import {useIdentityStore} from "./store/IdentityStore";
import {useTodos} from "./hooks/useTodos";
import {useState} from "react";
import SharedSnackbar, {SnackbarType} from "./shared/components/SharedSnackbar";


export default function Home() {
    // get auth info
    const identity = useIdentityStore(i => i.identity);

    const [snackbar, setSnackbar] = useState({
        open: false,
        type: "success" as SnackbarType,
        message: "",
        duration: 0
    });

    // callback for hook to show snackbar for actions
    const notify = (type: "success" | "error", message: string) => {
        setSnackbar({
            open: true,
            type,
            message,
            duration: 3000
        });
    };

    // trigger todo hooks
    const {
        filteredTodos,
        addTodo,
        deleteTodo,
        toggleTodo,
        setReminder,
        searchTodo
    } = useTodos(notify);

    return (
        <ReminderContext.Provider value={{ setReminder }}>
            <div className="mat-card">
                <h1 className="h1-tag">Todo List for {identity?.name ?? "Guest"}</h1>
                <SearchTodo searchTodo={searchTodo}></SearchTodo>
                <TodoList todos={filteredTodos} deleteTodo={deleteTodo} toggleTodo={toggleTodo}></TodoList>
                <div className="flex justify-between">
                    <CreateTodo addTodo={addTodo}></CreateTodo>
                    <TodoFilter />
                </div>
            </div>

            <SharedSnackbar
                open={snackbar.open}
                type={snackbar.type}
                message={snackbar.message}
                duration={snackbar.duration}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </ReminderContext.Provider>
    );
}
