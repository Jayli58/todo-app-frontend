import { render, screen } from "@testing-library/react";
import UserTag from "../UserTag";

describe("UserTag", () => {
    it("renders the user name", () => {
        render(<UserTag name="Alex" />);

        expect(screen.getByText("Alex")).toBeInTheDocument();
    });
});
