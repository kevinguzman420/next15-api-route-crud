// src/routes/api/sigin.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSession } from "@/lib/createSessionUser";
import { authenticateUser } from "@/lib/authenticateUser";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required please try again" },
      {
        status: 400,
      }
    );
  }

  try {
    const resp = await authenticateUser(email, password); // return {user: { id, email },...}
    if (!resp?.user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        {
          status: 401,
        }
      );
    } else {
      return await createSession(resp.user); // return {message: "Session created successfully", user}
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error signing in user" },
      {
        status: 500,
      }
    );
  }
}
