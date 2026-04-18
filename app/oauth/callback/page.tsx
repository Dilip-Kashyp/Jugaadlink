"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setItem } from "@/app/Services/cookieStorage";
import { LOCAL_STORAGE_KEY, PAGE_ROUTES } from "@/app/constants";

/**
 * /oauth/callback
 *
 * The backend redirects here after a successful Google/GitHub OAuth flow:
 *   http://localhost:3000/oauth/callback?token=<JWT>
 *
 * Stores the token exactly like the normal login flow, then navigates
 * to the dashboard.
 */
export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, token);
      router.replace(PAGE_ROUTES.DASHBOARD);
    } else {
      // Provider error or missing token → back to login
      console.error("OAuth callback error:", error ?? "no token received");
      router.replace(PAGE_ROUTES.LOGIN);
    }
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "16px",
        background: "var(--background)",
        color: "var(--foreground-muted)",
        fontFamily: "inherit",
        fontSize: "0.95rem",
      }}
    >
      {/* Branded spinner */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        style={{ animation: "oauth-spin 0.9s linear infinite" }}
      >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.15" />
        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        <style>{`
          @keyframes oauth-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </svg>
      <p style={{ margin: 0, fontWeight: 500 }}>Signing you in…</p>
      <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>You will be redirected shortly</p>
    </div>
  );
}
