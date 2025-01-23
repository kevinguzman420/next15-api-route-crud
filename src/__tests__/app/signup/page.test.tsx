import SignupPage from "@/app/signup/page";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { loginSchema } from "@/schemas/login.schema";
import { redirect } from "next/navigation";

test("renders sing-up form with email and password fields", () => {
  render(<SignupPage />);

  expect(screen.getByText("Sign Up")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});

const validData = { email: "test@example.com", password: "password123" };
const invalidData = { email: "", password: "" };

// unit test - form validation
test("validates email and password fields", () => {
  expect(loginSchema.safeParse(validData).success).toBe(true);
  expect(loginSchema.safeParse(invalidData).success).toBe(false);
});

// integration test - form submit
beforeEach(() => {
  global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
    Promise.resolve(
      new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    )
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

test("submits form and redirect on success", async () => {
  render(<SignupPage />);

  await act(() => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: validData.email },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: validData.password },
    });
  });

  await act(() => {
    fireEvent.click(screen.getByText("Sign up"));
  });

  expect(global.fetch).toHaveBeenCalledWith("/api/public/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validData),
  });

  expect(redirect).toHaveBeenCalledWith("/signin");
});
