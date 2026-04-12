"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, BarChart3, QrCode, Link as LinkIcon, Zap, ShieldCheck } from "lucide-react";
import { Typography, Button, ThemeToggle } from "../common";
import { useRouter } from "next/navigation";
import { HERO_SUBTEXT } from "@/app/constants";

gsap.registerPlugin(ScrollTrigger);

export default function LandinPage() {
  const router = useRouter();

  // Animation Refs
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        }
      );
    }
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div className="w-full bg-[var(--background)] text-[var(--foreground)] min-h-screen py-16 px-4 md:px-8 flex flex-col items-center overflow-x-hidden font-body selection:bg-[var(--primary)] selection:text-[var(--foreground)] relative">
      <div className="absolute top-8 right-8 z-50">
         <ThemeToggle className="!p-4 bg-[var(--secondary)] shadow-[4px_4px_0_0_var(--foreground)]" />
      </div>
      
      {/* Trendy Bento Grid Layout */}
      <div ref={gridRef} className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-[minmax(300px,_auto)_minmax(250px,_auto)_minmax(200px,_auto)] gap-6 relative">
        
        {/* 1. Hero Bento Card (Spans 2 columns, 2 rows aesthetically) */}
        <div 
          ref={addToRefs} 
          className="md:col-span-2 md:row-span-2 bg-[var(--secondary)] neo-brutal p-8 md:p-12 flex flex-col justify-between border-[var(--border-width)] border-[var(--border-default)] shadow-[8px_8px_0_0_var(--foreground)] hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--foreground)] transition-all"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--primary)] px-3 py-1 border-[var(--border-width)] border-[var(--border-default)] text-xs font-black uppercase tracking-widest mb-8 -rotate-2">
              <Zap size={14} className="fill-current" /> Next-Gen Platform
            </div>
            <Typography typographyProps={{ level: 1, className: "!text-5xl md:!text-7xl !font-black !font-heading leading-[0.9] tracking-tighter" }}>
              The Clever Way <br/> To Manage <br/> Your Links.
            </Typography>
            <p className="mt-8 font-bold text-lg opacity-80 leading-relaxed max-w-md">
              {HERO_SUBTEXT}
            </p>
          </div>
          
          <div className="mt-12 flex gap-4">
             <Button buttonProps={{ 
               type: "primary", 
               onClick: () => router.push('/dashboard'),
               className: "!bg-[var(--foreground)] !text-[var(--secondary)] !border-[var(--border-width)] !border-[var(--foreground)] hover:!bg-[var(--primary)] hover:!text-[var(--foreground)] !h-14 !px-8 !text-lg !font-black uppercase tracking-widest flex items-center gap-2"
             }}>
               Start Free <ArrowUpRight size={20} className="stroke-[3px]" />
             </Button>
          </div>
        </div>

        {/* 2. QR Code Generation Card (High review trend) */}
        <div ref={addToRefs} className="md:col-span-1 md:row-span-1 bg-[var(--primary)] p-8 border-[var(--border-width)] border-[var(--border-default)] flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
             <QrCode size={150} />
          </div>
          <div className="z-10 relative">
             <div className="w-12 h-12 bg-[var(--secondary)] border-[var(--border-width)] border-[var(--border-default)] flex items-center justify-center mb-6">
                <QrCode size={24} className="text-[var(--foreground)]" />
             </div>
             <h3 className="text-2xl font-black font-heading leading-tight">Branded<br/>QR Codes</h3>
             <p className="mt-2 text-sm font-bold opacity-80 uppercase tracking-wider">Bridge offline & online</p>
             <a href="#" className="mt-4 font-black uppercase text-xs tracking-widest flex items-center gap-1 group/link w-max">
               Learn more <ArrowUpRight size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
             </a>
          </div>
        </div>

        {/* 3. Advanced Analytics Card (High review trend) */}
        <div ref={addToRefs} className="md:col-span-1 md:row-span-1 bg-[var(--foreground)] text-[var(--secondary)] p-8 border-[var(--border-width)] border-[var(--border-default)] flex flex-col justify-between group">
           <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-[var(--secondary)] text-[var(--foreground)] border-[var(--border-width)] border-[var(--border-default)] flex items-center justify-center -rotate-6">
                 <BarChart3 size={24} />
              </div>
              <span className="text-xs uppercase font-black tracking-widest px-2 py-1 bg-[var(--accent-gray)]">Live</span>
           </div>
           <div>
             <h3 className="text-2xl font-black font-heading leading-tight mb-2">Deep<br/>Analytics</h3>
             <div className="flex items-end gap-2 mt-4">
               <div className="w-2 h-4 bg-[var(--primary)] group-hover:h-8 transition-all duration-300"></div>
               <div className="w-2 h-6 bg-[var(--primary)] group-hover:h-12 transition-all duration-300 delay-100"></div>
               <div className="w-2 h-3 bg-[var(--primary)] group-hover:h-10 transition-all duration-300 delay-200"></div>
               <div className="w-2 h-8 bg-[var(--primary)] group-hover:h-16 transition-all duration-300 delay-300"></div>
             </div>
             <a href="#" className="mt-6 font-black uppercase text-xs tracking-widest flex items-center gap-1 group/link w-max">
               Learn more <ArrowUpRight size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
             </a>
           </div>
        </div>

        {/* 4. Link Management / Routing (High review trend) */}
        <div ref={addToRefs} className="md:col-span-2 md:row-span-1 bg-[var(--background-muted)] p-8 border-[var(--border-width)] border-[var(--border-default)] flex flex-col justify-center">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[var(--secondary)] border-[var(--border-width)] border-[var(--border-default)] rounded-full flex items-center justify-center shrink-0">
                <LinkIcon size={28} className="text-[var(--primary)] stroke-[3px]" />
              </div>
              <div>
                <h3 className="text-3xl font-black font-heading mb-2">Jugaadlink Engine</h3>
                <p className="font-bold opacity-70 text-sm md:text-base">Custom domains, ultra-fast routing, and secure link management designed for scale.</p>
              </div>
           </div>
        </div>

        {/* 5. Trust / Security Card */}
        <div ref={addToRefs} className="md:col-span-1 md:row-span-1 bg-[var(--accent-yellow)] p-8 border-[var(--border-width)] border-[var(--border-default)] flex flex-col justify-center items-center text-center">
          <ShieldCheck size={48} className="mb-4 stroke-[2px]" />
          <h3 className="text-xl font-black font-heading">Secure by Design</h3>
          <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-80">99.9% Uptime SLA</p>
        </div>

        {/* 6. Social Proof / Quote */}
        <div ref={addToRefs} className="md:col-span-3 md:row-span-1 bg-[var(--secondary)] p-8 md:p-10 border-[var(--border-width)] border-[var(--border-default)] flex flex-col md:flex-row items-center justify-between gap-8 shadow-[6px_6px_0_0_var(--primary)]">
           <Typography typographyProps={{ level: 4, className: "!font-black !leading-tight !text-xl md:!text-3xl m-0 max-w-2xl" }}>
             "Jugaadlink completely changed how we manage our campaign infrastructure. It's simply the cleverest tool in our stack."
           </Typography>
           <div className="flex items-center gap-4 shrink-0 border-l-0 md:border-l-[var(--border-width)] border-[var(--border-default)] pt-4 md:pt-0 md:pl-8 mt-4 md:mt-0 w-full md:w-auto">
             <div className="w-15 h-15 bg-[var(--primary)] border-[var(--border-width)] border-[var(--border-default)] flex items-center justify-center p-2 font-black text-xs uppercase text-center break-all leading-none">
                Dev
             </div>
             <div>
               <p className="font-black text-sm m-0">Dilip Kumar</p>
               <p className="text-xs m-0 font-bold opacity-80 uppercase tracking-widest">Engineer </p>
             </div>
           </div>
        </div>

      </div>

    </div>
  );
}