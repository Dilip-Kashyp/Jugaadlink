"use client";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { Button, Flex, Typography } from "../common";
import { LOGIN } from "@/app/constants";
import { useCurrentUser, useLogout } from "@/app/Services";

export default function Navbar() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-3 flex items-center justify-between bg-[var(--secondary)] border-b-[var(--border-width)] border-[var(--border-default)] shadow-[0_4px_0_0_var(--border-default)]">
      <Link href="/" className="text-xl font-black uppercase tracking-wider flex items-center gap-1 font-heading">
        <span className="bg-[var(--primary)] text-[var(--foreground)] px-2 py-1 border-[var(--border-width)] border-[var(--border-default)] -rotate-2">JUGAAD</span>
        <span className="text-[var(--foreground)] mt-1">LINK</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="w-20 h-8 bg-black/10 animate-pulse" />
        ) : user ? (
          <Flex gap={4} align="center">
            <Typography level={5} className="!mb-0 font-bold">
              Hi, {user?.data?.[0]?.name || "User"}
            </Typography>
            <Button
              type="default"
              icon={<LogOut size={16} />}
              onClick={logout}
              className="neo-brutal flex items-center gap-2 font-bold ml-4"
            >
              Logout
            </Button>
          </Flex>
        ) : (
          <Link href="/login">
            <Button
              type="primary"
              className="neo-brutal !bg-black !text-white !px-6 !h-11 flex items-center gap-2 font-bold"
            >
              <span className="mr-1">{LOGIN}</span>
              <LogIn size={16} />
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
