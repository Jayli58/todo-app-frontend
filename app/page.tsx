"use client";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import { ReminderContext } from "./context/ReminderContext";
import CreateTodo from "./components/CreateTodo/CreateTodo";
import SearchTodo from "./components/SearchTodo";
import { useIdentityStore } from "./store/IdentityStore";
import { useTodos } from "./hooks/useTodos";
import SharedSnackbar from "./shared/components/SharedSnackbar";
import useSnackbar from "./shared/hooks/useSnackbar";
import UserTag from "./shared/components/UserTag";
import { useLoadingStore } from "./store/LoadingStore";


export default function Home() {
    // get auth info
    const identity = useIdentityStore(i => i.identity);

    const { snackbar, notify, closeSnackbar } = useSnackbar();

    // trigger todo hooks
    const {
        filteredTodos,
        addTodo,
        deleteTodo,
        toggleTodo,
        setReminder,
        searchTodo,
        loadMore,
        hasMore,
        badgeNums
    } = useTodos(notify);

    // get loading state for initial fetch + search
    const isFetching = useLoadingStore(
        (s) => s.isLoading("fetch") || s.isLoading("search")
    );
    // get loading state for load more
    const isLoadingMore = useLoadingStore(
        (s) => s.isLoading("loadMore")
    );

    // console.log("identity: ", identity?.name);

    return (
        <ReminderContext.Provider value={{ setReminder }}>
            <div className="mat-card">
                <UserTag name={identity?.name ?? "Guest"} />
                <h1 className="h1-tag">Todo List</h1>

                <SearchTodo searchTodo={searchTodo} />
                <TodoList
                    todos={filteredTodos}
                    deleteTodo={deleteTodo}
                    toggleTodo={toggleTodo}
                    loading={isFetching}
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    loadingMore={isLoadingMore}
                />
                <div className="todo-actions-row">
                    <CreateTodo addTodo={addTodo} />
                    <TodoFilter
                        totalNum={badgeNums.totalNum}
                        activeNum={badgeNums.activeNum}
                        completedNum={badgeNums.completedNum}
                    />
                </div>
            </div>

            <SharedSnackbar
                open={snackbar.open}
                type={snackbar.type}
                message={snackbar.message}
                duration={snackbar.duration}
                onClose={closeSnackbar}
            />
        </ReminderContext.Provider>
    );
}
