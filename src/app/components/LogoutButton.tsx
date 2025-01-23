import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const { clearUser } = useAuthStore();
  const handleLogout = async () => {
    const resp = await fetch("/api/protected/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (resp.ok) {
      clearUser(); // delete user from store
      redirect("/signin");
    } else {
      console.log("Error al cerrar sesión");
    }
  };
  return (
    <Button variant="secondary" onClick={handleLogout}>
      Sign Out <LogOut />
    </Button>
  );
}
