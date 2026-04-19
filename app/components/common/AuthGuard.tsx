"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_KEY, PAGE_ROUTES } from "@/app/constants";

type AuthGuardProps = {
  /** 'guest'  → only unauthenticated users (login/signup pages) */
  /** 'auth'   → only authenticated users (dashboard page) */
  mode: "guest" | "auth";
  children: React.ReactNode;
};

/**
 * Client-side route guard.
 * - mode="guest" : if a token exists → redirect to /dashboard
 * - mode="auth"  : if no token exists → redirect to /login
 * Renders nothing (null) while the redirect is pending so there's no flash.
 */
export default function AuthGuard({ mode, children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    if (mode === "guest" && token) {
      router.replace(PAGE_ROUTES.DASHBOARD);
    } else if (mode === "auth" && !token) {
      router.replace(PAGE_ROUTES.LOGIN);
    }
  }, [mode, router]);

  // Return children immediately; the redirect above runs async.
  // The brief flash is acceptable and much simpler than a loading spinner
  // that blocks SSR-friendly rendering.
  return <>{children}</>;
}
