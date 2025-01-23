import SigninPage from "@/app/signin/page";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { loginSchema } from "@/schemas/login.schema";
import { redirect } from "next/navigation";
import { axe, toHaveNoViolations } from "jest-axe";

// render test - test if the page renders correctly
test("renders sign-in form with email and password fields", () => {
  render(<SigninPage />);

  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});

const validData = { email: "test@example.com", password: "password123" };
const invalidData = { email: "", password: "" };

// unit test - form validation (schema)
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
  render(<SigninPage />);

  await act(() => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: validData.email },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: validData.password },
    });
  });

  await act(() => {
    fireEvent.click(screen.getByText("Sign in"));
  });

  expect(global.fetch).toHaveBeenCalledWith("/api/public/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validData),
  });

  expect(redirect).toHaveBeenCalledWith("/dashboard");
});

//
// * This test is to check if the error message is displayed when the user enters invalid data
//

beforeEach(() => {
  jest.clearAllMocks();
});

test("displays error message on invalid email or password", async () => {
  // Mock de fetch con error
  global.fetch = jest.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify({ message: "Invalid email or password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    )
  ) as jest.Mock;

  render(<SigninPage />);

  // Simula los cambios en los campos del formulario
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "invalidemail@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "wrongpassword" },
  });

  // Simula el envío del formulario
  await act(async () => {
    fireEvent.click(screen.getByText("Sign in"));
  });

  // Verifica que se haya llamado fetch con los datos correctos
  expect(global.fetch).toHaveBeenCalledWith("/api/public/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "invalidemail@example.com",
      password: "wrongpassword",
    }),
  });

  // Verifica que el mensaje de error se muestre en la pantalla
  // OPTION 1
  //   expect(screen.getByRole("alert")).toHaveTextContent(
  //     "Invalid email or password"
  //   );
  // OPTION 2
  expect(
    await screen.findByText("Invalid email or password")
  ).toBeInTheDocument();
});

// ! Don't DONE - Test the HTML elements haven't violations
// jest.mock("../../../stores/authStore", () => ({
//   useAuthStore: () => ({
//     setUser: jest.fn(),
//   }),
// }));

// // Mock de Next.js navigation
// jest.mock("next/navigation", () => ({
//   redirect: jest.fn(),
// }));

// test("HTML elements haven't violations", async () => {
//   let container: HTMLElement | undefined;

//   await act(async () => {
//     const renderResult = render(<SigninPage />);
//     container = renderResult.container;
//   });

//   // Añadir una verificación para asegurar que container no es undefined
//   if (!container) {
//     throw new Error("Container is undefined");
//   }

//   const results = await axe(container);
//   expect(results).toHaveNoViolations();
// });
