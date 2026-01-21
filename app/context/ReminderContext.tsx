'use client';

import { createContext, useContext } from "react";

interface ReminderContextType {
    setReminder: (todoId: string, timestamp: number | null) => Promise<boolean>;
}

export const ReminderContext = createContext<ReminderContextType>({
    setReminder: async () => false,
});

export const useReminder = () => useContext(ReminderContext);
