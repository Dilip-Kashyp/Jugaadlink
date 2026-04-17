"use client";
import { ShieldOff, ArrowLeft, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DisabledContent() {
  const params = useSearchParams();
  const code = params.get("code") || "";
  const reason = params.get("reason");

  const getContent = () => {
    if (reason === "expired") return { icon: <Clock size={48} />, title: "Link Expired", desc: "This link has self-destructed. It was set to expire after a certain time and that time has passed." };
    if (reason === "limit") return { icon: <AlertTriangle size={48} />, title: "Click Limit Reached", desc: "This link has been clicked the maximum number of times allowed by its creator." };
    return { icon: <ShieldOff size={48} />, title: "Link Deactivated", desc: "The owner of this link has temporarily disabled it. It may be reactivated in the future." };
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
          {content.icon}
        </div>
        <h1 className="text-3xl font-black font-heading tracking-tight mb-3 text-[var(--foreground)]">
          {content.title}
        </h1>
        <p className="text-[var(--foreground-muted)] text-base mb-8 leading-relaxed">
          {content.desc}
        </p>
        {code && (
          <div className="mb-8 px-4 py-3 bg-[var(--background-muted)] rounded-xl">
            <span className="text-sm font-mono text-[var(--foreground-subtle)]">/{code}</span>
          </div>
        )}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity no-underline"
        >
          <ArrowLeft size={18} /> Go to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function LinkDisabledPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-[var(--foreground-muted)]">Loading...</div></div>}>
      <DisabledContent />
    </Suspense>
  );
}
