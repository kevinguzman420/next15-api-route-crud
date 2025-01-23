import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

describe("Home page", () => {
  it("should render the title", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("should render: Welcome to this Next.js app", () => {
    render(<Home />);

    screen.getByText("Welcome to this Next.js app");
  });
});
