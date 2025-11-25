'use client';

import { createContext, useContext } from "react";

interface ReminderContextType {
    setReminder: (id: number, timestamp: number | null) => void;
}

export const ReminderContext = createContext<ReminderContextType>({
    setReminder: () => {}
});

export const useReminder = () => useContext(ReminderContext);
