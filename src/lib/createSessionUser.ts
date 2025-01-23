// lib/createSessionUser.ts - Crear una sesión de usuario
import { randomUUID } from "crypto";
import { prisma } from "./prisma";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

type User = {
  id: number;
  email: string;
};

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "clave_secreta_de_desarrollo_insegura"
);

export async function createSession(user: User) {
  const payload = { email: user.email };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // Algoritmo de firma
    .setExpirationTime("1h") // Expira en 1 hora
    .sign(secret);

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: Missing token" },
      { status: 401 }
    );
  }

  await prisma.session.create({
    data: {
      sessionToken: token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  const response = NextResponse.json(
    { message: "Session created successfully", user },
    { status: 201 }
  );

  response.cookies.set("session_token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: "lax",
  });

  return response;
}
