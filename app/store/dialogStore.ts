import { create } from "zustand";

interface DialogStore {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
    isDialogOpen: false,
    setDialogOpen: (open) => set({ isDialogOpen: open }),
}));
