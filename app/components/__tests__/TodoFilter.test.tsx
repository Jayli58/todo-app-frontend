import { render, screen, fireEvent } from "@testing-library/react";
import TodoFilter from "../TodoFilter";
import { FilterType } from "../../dataType/FilterTypes";

const useFilterStoreMock = jest.fn();
const useDialogStoreMock = jest.fn();

jest.mock("../../store/FilterStore", () => ({
    useFilterStore: (selector: (state: { filter: FilterType; setFilter: jest.Mock }) => unknown) =>
        useFilterStoreMock(selector),
}));

jest.mock("../../store/DialogStore", () => ({
    useDialogStore: (selector: (state: { isDialogOpen: boolean }) => unknown) =>
        useDialogStoreMock(selector),
}));

describe("TodoFilter", () => {
    it("updates filter when clicking Active", () => {
        const setFilter = jest.fn();

        // a stub defining fake state
        useFilterStoreMock.mockImplementation((selector) =>
            selector({ filter: FilterType.ALL, setFilter })
        );
        useDialogStoreMock.mockImplementation((selector) =>
            selector({ isDialogOpen: false })
        );

        render(<TodoFilter totalNum={3} activeNum={2} completedNum={1} />);

        fireEvent.click(screen.getByText("Active"));

        expect(setFilter).toHaveBeenCalledWith(FilterType.ACTIVE);
    });
});
