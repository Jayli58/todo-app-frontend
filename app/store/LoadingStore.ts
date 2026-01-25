import { create } from "zustand";

// Action types that can be in a loading state
export type LoadingAction =
    | "fetch"               // initial fetch
    | "create"              // create todo
    | "search"              // search todo
    | `toggle:${string}`    // toggle:todoId
    | `delete:${string}`    // delete:todoId
    | `reminder:${string}`; // reminder:todoId

interface LoadingState {
    // Set of currently loading actions
    loadingActions: Set<string>;

    // Start loading for an action
    startLoading: (action: LoadingAction) => void;

    // Stop loading for an action
    stopLoading: (action: LoadingAction) => void;

    // Check if a specific action is loading
    isLoading: (action: LoadingAction) => boolean;

    // Check if any action of a type is loading (for todoId-based actions)
    isAnyLoading: (prefix: "toggle" | "delete" | "reminder") => boolean;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
    loadingActions: new Set(),

    startLoading: (action) => set((state) => {
        const next = new Set(state.loadingActions);
        next.add(action);
        return { loadingActions: next };
    }),

    stopLoading: (action) => set((state) => {
        const next = new Set(state.loadingActions);
        next.delete(action);
        return { loadingActions: next };
    }),

    isLoading: (action) => get().loadingActions.has(action),

    isAnyLoading: (prefix) => {
        const actions = get().loadingActions;
        for (const action of actions) {
            if (action.startsWith(`${prefix}:`)) return true;
        }
        return false;
    }
}));

// Helper to create a loading wrapper for API calls
export function withLoading<T>(
    action: LoadingAction,
    apiCall: () => Promise<T>
): Promise<T> {
    const { startLoading, stopLoading } = useLoadingStore.getState();
    startLoading(action);
    return apiCall().finally(() => stopLoading(action));
}
