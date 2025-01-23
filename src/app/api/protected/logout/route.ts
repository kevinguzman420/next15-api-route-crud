// src/routes/api/logout.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  // delete session from database
  await prisma.session.deleteMany({
    where: {
      sessionToken: token,
    },
  });

  const response = NextResponse.json(
    { message: "Logged out successfully" },
    {
      status: 200,
    }
  );
  response.cookies.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Elimina la cookie
    path: "/",
  });

  return response;
}
