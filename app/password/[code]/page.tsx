"use client";
import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useVerifyPassword } from "../../Services/useUrlShortener";
import { getresponseError } from "../../Services/apiClient";

function PasswordContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = params.code as string;
  const hasError = searchParams.get("error") === "invalid";

  const [password, setPassword] = useState("");
  const [error, setError] = useState(hasError ? "Incorrect password. Please try again." : "");

  const { mutate: verifyPassword, isPending } = useVerifyPassword({
    mutationConfig: {
      onSuccess: (data: { data: { redirect_url: string } }) => {
        if (data?.data?.redirect_url) {
          window.location.href = data.data.redirect_url;
        }
      },
      onError: (err: any) => {
        const { message } = getresponseError(err);
        setError(message || "Incorrect password");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    verifyPassword({ code, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-[var(--primary)]">
            <Lock size={36} />
          </div>
          <h1 className="text-2xl font-black font-heading tracking-tight mb-2 text-[var(--foreground)]">
            Protected Link
          </h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            This link is password protected. Enter the password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-6 shadow-lg">
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoFocus
              className="w-full bg-[var(--background)] border border-[var(--border-default)] text-base font-medium px-4 py-3.5 rounded-xl outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !password}
            className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-white font-bold text-base px-6 py-3.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              <>Unlock Link <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-[var(--foreground-subtle)]">
          Don&apos;t know the password? Contact the person who shared this link.
        </p>
      </div>
    </div>
  );
}

export default function PasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse">Loading...</div></div>}>
      <PasswordContent />
    </Suspense>
  );
}
