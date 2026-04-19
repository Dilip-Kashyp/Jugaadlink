"use client";
import Link from "next/link";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Button, Flex, ThemeToggle } from "../common";
import { LOGIN, PAGE_ROUTES } from "@/app/constants";
import { useCurrentUser, useLogout } from "@/app/Services";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3">
      <Flex
        align="center"
        justify="space-between"
        className="w-full max-w-6xl glass rounded-2xl px-5 py-3 shadow-lg"
      >
        <Link href="/" className="flex items-center gap-2.5 group no-underline">
          <div className="w-9 h-9 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform">
            J
          </div>
          <span className="font-heading font-black text-lg tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
            jugaadlink.
          </span>
        </Link>

        <Flex align="center" gap={12}>
          {isLoading ? (
            <div className="w-20 h-9 bg-[var(--background-muted)] rounded-full animate-pulse" />
          ) : user ? (
            <Flex gap={12} align="center">
              <span className="text-sm font-semibold text-[var(--foreground-muted)] hidden md:block">
                Hi, <span className="text-[var(--primary)] font-bold">{user?.data?.name?.split(' ')[0] || "User"}</span>
              </span>
              {pathname !== PAGE_ROUTES.DASHBOARD && <Link href={PAGE_ROUTES.DASHBOARD}>
                <Button
                  type="default"
                  icon={<LayoutDashboard size={16} />}
                  className="!flex !items-center !gap-2 !bg-[var(--primary-subtle)] !text-[var(--primary)] hover:!bg-[var(--primary)] hover:!text-white !rounded-xl !px-4 !h-9 !text-sm !font-semibold transition-all !py-0 !border-0"
                >
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>}
              <Button
                type="text"
                icon={<LogOut size={16} />}
                onClick={logout}
                className="!flex !items-center !gap-2 !bg-[var(--background-muted)] !text-[var(--foreground-muted)] hover:!bg-red-50 dark:hover:!bg-red-500/10 hover:!text-red-500 !rounded-xl !px-4 !h-9 !text-sm !font-semibold transition-all !py-0"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </Flex>
          ) : (
            <Link href="/login">
              <Button
                type="primary"
                className="!h-9 !px-5 !rounded-xl !text-sm !font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow !py-0"
              >
                <span>{LOGIN}</span>
                <LogIn size={15} />
              </Button>
            </Link>
          )}
          <ThemeToggle className="!h-9 !w-9 !rounded-xl !bg-[var(--background-muted)] hover:!bg-[var(--border-default)] !p-0 !flex !items-center !justify-center !border-none transition-colors" />
        </Flex>
      </Flex>
    </div>
  );
}
