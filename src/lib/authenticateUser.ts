// lib/authenticateUser.ts - Verificar si el usuario existe y si la contraseña es correcta

import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// this type represents the user object in the database
type User = {
  id: number;
  email: string;
};

interface AuthenticateUser {
  user?: User;
  message?: string;
  success: boolean;
}
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthenticateUser> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // not found user
  if (!user) {
    return {
      message: "Invalid email or password",
      success: false,
    };
  }

  // check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return {
      message: "Invalid email or password",
      success: false,
    };
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    message: "User signed in successfully",
    success: true,
  };
}
