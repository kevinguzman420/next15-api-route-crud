// components/NavigationWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import NavbarPublic from "./public/NavbarPublic";
import NavbarDashboard from "./NavbarDashboard";
import { useAuthStore } from "@/stores/authStore";

const NavigationWrapper = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <NavbarDashboard /> : <NavbarPublic />;
};

export default NavigationWrapper;
