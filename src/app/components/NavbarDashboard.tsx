"use client";
import Link from "next/link";
import { ToggleDarkmode } from "./ToggleDarkmode";
import { buttonVariants } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";

export default function NavbarDashboard() {
  return (
    <nav className=" flex justify-between items-center h-[70px] border-b-2 border-gray-800 px-4 py-2">
      <Link
        href="/dashboard/tasks"
        className="flex items-center gap-2 py-2 px-4 text-2xl font-bold"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
        <span>Seven Code</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/new"
          className={buttonVariants({ variant: "secondary" })}
        >
          <h2>New Task</h2>
        </Link>
        <ToggleDarkmode />
        <LogoutButton />
      </div>
    </nav>
  );
}
