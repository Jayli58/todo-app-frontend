import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import TimePickerDialog from "../TimePickerDialog";

const setReminder = jest.fn();

jest.mock("../../../../context/ReminderContext", () => ({
    useReminder: () => ({ setReminder }),
}));

jest.mock("@mui/x-date-pickers", () => ({
    MobileDateTimePicker: ({ onChange }: { onChange: (value: any) => void }) => (
        <button type="button" onClick={() => onChange(dayjs("2020-01-01"))}>
            Pick
        </button>
    ),
}));

jest.mock("@mui/x-date-pickers/LocalizationProvider", () => ({
    LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@mui/x-date-pickers/AdapterDayjs", () => ({
    AdapterDayjs: function AdapterDayjs() {},
}));

describe("TimePickerDialog", () => {
    it("saves reminder and closes on success", async () => {
        setReminder.mockResolvedValue(true);
        const onClose = jest.fn();

        render(
            <TimePickerDialog
                todo={{
                    todoId: "99",
                    title: "Task",
                    content: "Content",
                    statusCode: "Incomplete",
                    remindTimestamp: null,
                }}
                open
                onClose={onClose}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Pick" }));
        fireEvent.click(screen.getByRole("button", { name: "Set" }));

        const expectedTimestamp = dayjs("2020-01-01").unix();

        await waitFor(() => {
            expect(setReminder).toHaveBeenCalledWith("99", expectedTimestamp);
        });
        expect(onClose).toHaveBeenCalled();
    });

    it("closes on Escape", () => {
        setReminder.mockResolvedValue(true);
        const onClose = jest.fn();

        render(
            <TimePickerDialog
                todo={{
                    todoId: "99",
                    title: "Task",
                    content: "Content",
                    statusCode: "Incomplete",
                    remindTimestamp: null,
                }}
                open
                onClose={onClose}
            />
        );

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onClose).toHaveBeenCalled();
    });
});
