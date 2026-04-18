"use client";
import React, { useState } from "react";
import { API_ENDPOINTS } from "@/app/constants";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.333 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.000 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.314 0-9.823-3.419-11.371-8.124l-6.515 5.022C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24v8h11.303C34.536 31.657 29.333 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const Spinner = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </svg>
);

interface OAuthButtonsProps {
  mode?: "login" | "signup";
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ mode = "login" }) => {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  // OAuth initiation routes live under /api/v1 — use the API base URL
  const baseApiUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");

  const handleOAuth = (provider: "google" | "github") => {
    setLoading(provider);
    const endpoint = provider === "google" ? API_ENDPOINTS.OAUTH_GOOGLE : API_ENDPOINTS.OAUTH_GITHUB;
    window.location.href = `${baseApiUrl}${endpoint}`;
  };

  const label = mode === "signup" ? "Sign up" : "Continue";

  const btnClass = `
    flex items-center justify-center gap-3 w-full h-12
    rounded-xl border border-[var(--border-default)]
    bg-[var(--background)] hover:bg-[var(--background-subtle)]
    text-[var(--foreground)] font-semibold text-sm
    transition-all duration-200 ease-in-out
    hover:shadow-md hover:border-[var(--primary)]
    active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
  `;

  return (
    <div className="w-full">
      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[var(--border-default)]" />
        <span className="text-xs text-[var(--foreground-muted)] font-medium tracking-wide uppercase select-none">
          or continue with
        </span>
        <div className="flex-1 h-px bg-[var(--border-default)]" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          id="oauth-google-btn"
          onClick={() => handleOAuth("google")}
          disabled={loading !== null}
          type="button"
          className={btnClass}
        >
          {loading === "google" ? <Spinner /> : <GoogleIcon />}
          {loading === "google" ? "Redirecting…" : `${label} with Google`}
        </button>

        <button
          id="oauth-github-btn"
          onClick={() => handleOAuth("github")}
          disabled={loading !== null}
          type="button"
          className={btnClass}
        >
          {loading === "github" ? <Spinner /> : <GitHubIcon />}
          {loading === "github" ? "Redirecting…" : `${label} with GitHub`}
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;
