import { useFilterStore } from "../FilterStore";
import { FilterType } from "../../dataType/FilterTypes";

describe("FilterStore", () => {
    // reset store after each test to avoid state leaks
    afterEach(() => {
        useFilterStore.setState({ filter: FilterType.ALL });
    });

    it("defaults to ALL", () => {
        expect(useFilterStore.getState().filter).toBe(FilterType.ALL);
    });

    it("updates filter", () => {
        useFilterStore.getState().setFilter(FilterType.COMPLETED);
        expect(useFilterStore.getState().filter).toBe(FilterType.COMPLETED);
    });
});
