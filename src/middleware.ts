import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "clave_secreta_de_desarrollo_insegura"
);

export async function middleware(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("session_token")?.value;

  if (!token) {
    // return NextResponse.redirect(new URL("/signin", request.url));
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
    // simulate an error
    // throw new Error("Simulated error");
  } catch (error) {
    // return NextResponse.json({ message: "Server Error" }, { status: 500 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: "/api/protected/:path*",
  // matcher: "/api/((?!signup|signin).*)", // Esta solución usa una expresión regular negativa look-ahead (?!...)
};
