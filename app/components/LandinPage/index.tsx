"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight, BarChart3, QrCode, Zap, ShieldCheck,
  Globe, LayoutDashboard
} from "lucide-react";
import { Button, Flex } from "../common";
import { useRouter } from "next/navigation";
import { LANDING_PAGE_CONSTANTS } from "@/app/constants";
import { useCurrentUser } from "@/app/Services";

gsap.registerPlugin(ScrollTrigger);

export default function LandinPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
        }
      );
    }
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
      {/* Hero */}
      <div className="text-center py-8 sm:py-10 md:py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-subtle)] text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-5 sm:mb-6">
          <Zap size={14} /> {LANDING_PAGE_CONSTANTS.HERO.BADGE}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading tracking-tight leading-[1.05] mb-5 sm:mb-6 text-[var(--foreground)]">
          {LANDING_PAGE_CONSTANTS.HERO.TITLE_LINE_1}<br />
          <span className="text-[var(--primary)]">{LANDING_PAGE_CONSTANTS.HERO.TITLE_LINE_2}</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          {LANDING_PAGE_CONSTANTS.HERO.SUBTEXT}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Button
              type="primary"
              onClick={() => router.push('/dashboard')}
              className="!w-full sm:!w-auto !h-12 sm:!h-13 !px-7 sm:!px-8 !text-base !font-bold !rounded-xl !shadow-lg hover:!shadow-xl transition-shadow flex items-center gap-2"
            >
              <LayoutDashboard size={20} /> Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                type="primary"
                onClick={() => router.push('/login')}
                className="!w-full sm:!w-auto !h-12 sm:!h-13 !px-7 sm:!px-8 !text-base !font-bold !rounded-xl !shadow-lg hover:!shadow-xl transition-shadow flex items-center gap-2"
              >
                {LANDING_PAGE_CONSTANTS.HERO.CTA} <ArrowUpRight size={20} />
              </Button>
              {/* <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--background)] bg-[var(--background-muted)] overflow-hidden">
                      <img src={`https://i.pravatar.cc/80?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-[var(--foreground-muted)]">{LANDING_PAGE_CONSTANTS.HERO.TRUST_BADGE}</span>
              </div> */}
            </>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* QR Code */}
        <div ref={addToRefs} className="md:col-span-4 bg-[var(--primary)] text-white p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <QrCode size={180} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-5">
              <QrCode size={24} />
            </div>
            <h3 className="text-2xl font-black mb-2 !text-white">{LANDING_PAGE_CONSTANTS.FEATURES.QR_TITLE}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{LANDING_PAGE_CONSTANTS.FEATURES.QR_DESC}</p>
          </div>
        </div>

        {/* Analytics */}
        <div ref={addToRefs} className="md:col-span-4 bg-[var(--background-subtle)] border border-[var(--border-default)] p-8 rounded-2xl group">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-[var(--primary)]">
              <BarChart3 size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase">
              {LANDING_PAGE_CONSTANTS.FEATURES.ANALYTICS_BADGE}
            </span>
          </div>
          <h3 className="text-2xl font-black mb-2">{LANDING_PAGE_CONSTANTS.FEATURES.ANALYTICS_TITLE}</h3>
          <p className="text-[var(--foreground-muted)] text-sm leading-relaxed mb-6">{LANDING_PAGE_CONSTANTS.FEATURES.ANALYTICS_DESC}</p>
          <div className="flex items-end gap-1.5 h-14">
            {[4,8,6,10,7,5,9,8,6].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-[var(--primary-subtle)] group-hover:bg-[var(--primary)] transition-all duration-500" style={{ height: `${h * 10}%`, transitionDelay: `${i*40}ms` }} />
            ))}
          </div>
        </div>

        {/* Global Routing */}
        <div ref={addToRefs} className="md:col-span-4 bg-[var(--background-subtle)] border border-[var(--border-default)] p-8 rounded-2xl">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
            <Globe size={24} />
          </div>
          <h3 className="text-2xl font-black mb-2">{LANDING_PAGE_CONSTANTS.FEATURES.ROUTING_TITLE}</h3>
          <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">{LANDING_PAGE_CONSTANTS.FEATURES.ROUTING_DESC}</p>
        </div>

  
        {/* <div ref={addToRefs} className="md:col-span-6 bg-[var(--background-subtle)] border border-[var(--border-default)] p-8 rounded-2xl flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 flex-shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-1">{LANDING_PAGE_CONSTANTS.FEATURES.SECURITY_TITLE}</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">{LANDING_PAGE_CONSTANTS.FEATURES.SECURITY_BADGE}</p>
          </div>
        </div> */}

        {/* Testimonial */}
        {/* <div ref={addToRefs} className="md:col-span-6 bg-[var(--background-subtle)] border border-[var(--border-default)] p-8 rounded-2xl flex flex-col justify-between">
          <p className="text-lg font-medium italic text-[var(--foreground-muted)] leading-relaxed mb-6">
            &ldquo;{LANDING_PAGE_CONSTANTS.TESTIMONIAL.QUOTE}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--background-muted)] overflow-hidden">
              <img src="https://i.pravatar.cc/80?img=12" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-sm m-0">{LANDING_PAGE_CONSTANTS.TESTIMONIAL.AUTHOR}</p>
              <span className="text-xs text-[var(--foreground-subtle)]">{LANDING_PAGE_CONSTANTS.TESTIMONIAL.ROLE}</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-[var(--foreground-subtle)] font-mono">
          {LANDING_PAGE_CONSTANTS.FOOTER.COPYRIGHT}
        </span>
        {/* <div className="flex gap-6 text-xs font-semibold text-[var(--foreground-muted)]">
          {LANDING_PAGE_CONSTANTS.FOOTER.LINKS.map(link => (
            <a key={link} href="#" className="hover:text-[var(--primary)] transition-colors">{link}</a>
          ))}
        </div> */}
      </div>
    </div>
  );
}