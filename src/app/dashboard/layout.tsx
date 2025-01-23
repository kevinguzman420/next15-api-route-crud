// import { cookies } from "next/headers";
// import NavbarDashboard from "../components/NavbarDashboard";
import ProtectedPage from "../components/ProtectedPage";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const userCookie = await cookies();
  // const userSession = userCookie.has("session_token");
  return (
    <ProtectedPage>
      <div className=" container mx-auto px-4 ">
        {/* {userSession && <NavbarDashboard />} */}
        {children}
      </div>
    </ProtectedPage>
  );
}
