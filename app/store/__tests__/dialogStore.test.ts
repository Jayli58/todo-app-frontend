import { useDialogStore } from "../DialogStore";

describe("dialogStore", () => {
    afterEach(() => {
        useDialogStore.setState({ isDialogOpen: false });
    });

    it("defaults to closed", () => {
        expect(useDialogStore.getState().isDialogOpen).toBe(false);
    });

    it("updates dialog state", () => {
        useDialogStore.getState().setDialogOpen(true);
        expect(useDialogStore.getState().isDialogOpen).toBe(true);
    });
});
