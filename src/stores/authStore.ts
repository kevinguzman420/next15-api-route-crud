import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: { id: number; email: string } | null;
  isAuthenticated: boolean;
  setUser: (user: { id: number; email: string }) => void;
  clearUser: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },
      clearUser: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "session_data", // Nombre de la clave para el almacenamiento local
    }
  )
);
