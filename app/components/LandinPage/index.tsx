"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ArrowUpRight, BarChart3, QrCode, Link as LinkIcon, Zap, ShieldCheck, 
  MousePointer2, Sparkles, Globe, Layers, ArrowRight
} from "lucide-react";
import { Typography, Button, ThemeToggle, Card } from "../common";
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
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
        }
      );
    }
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div className="w-full bg-[var(--background)] text-[var(--foreground)] min-h-screen py-16 px-6 md:px-12 flex flex-col items-center overflow-x-hidden relative selection:bg-indigo-100">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none"></div>

      <nav className="max-w-7xl w-full flex justify-between items-center mb-16 lg:mb-24 z-50">
         <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">J</div>
            <Typography level={3} className="!font-black !tracking-tighter !m-0 !text-2xl">jugaadlink.</Typography>
         </div>
         <div className="flex items-center gap-6">
            <ThemeToggle className="!p-2.5 !bg-white !shadow-sm !rounded-xl !border !border-slate-100" />
            <Button onClick={() => router.push('/dashboard')} className="!hidden md:!flex !items-center !gap-2 !font-bold">
               Log In <ArrowRight size={16} />
            </Button>
         </div>
      </nav>
      
      {/* Bento Grid Layout */}
      <div ref={gridRef} className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 relative">
        
        {/* 1. Main Hero Card */}
        <div 
          ref={addToRefs} 
          className="md:col-span-8 md:row-span-2 premium-card !p-12 md:!p-20 flex flex-col justify-between border-slate-100 bg-white group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
             <Layers size={400} />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-widest mb-10">
              <Sparkles size={14} className="fill-current" /> Leading Shortening Architecture
            </div>
            <h1 className="text-5xl md:text-8xl font-black font-heading tracking-tight leading-[0.9] mb-8 text-slate-900">
              Smart links. <br/> <span className="text-indigo-600">Pure impact.</span>
            </h1>
            <p className="font-medium text-xl text-slate-500 leading-relaxed max-w-xl">
              {HERO_SUBTEXT}
            </p>
          </div>
          
          <div className="mt-16 flex flex-wrap gap-4 relative z-10">
             <Button
                type="primary" 
                onClick={() => router.push('/dashboard')}
                className="!h-16 !px-10 !text-xl !font-black !rounded-2xl !bg-indigo-600 !shadow-2xl !shadow-indigo-200 hover:!bg-indigo-700 hover:!scale-105 active:!scale-95 transition-all flex items-center gap-3"
             >
               Get Started Now <ArrowUpRight size={22} />
             </Button>
             <div className="flex -space-x-3 items-center ml-4">
                {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                   </div>
                ))}
                <span className="pl-6 text-xs font-bold text-slate-400">Trusted by 10k+ creators</span>
             </div>
          </div>
        </div>

        {/* 2. QR Code Card */}
        <div ref={addToRefs} className="md:col-span-4 md:row-span-1 premium-card !bg-indigo-600 text-white !p-10 flex flex-col justify-between group overflow-hidden border-none shadow-indigo-100">
          <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700">
             <QrCode size={220} />
          </div>
          <div className="z-10 relative">
             <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                <QrCode size={28} />
             </div>
             <h3 className="text-3xl font-black font-heading leading-tight mb-2">Dynamic<br/>QR Flow</h3>
             <p className="text-indigo-100 font-medium text-sm">Convert offline pulses to online impact with custom branded codes.</p>
          </div>
          <div className="z-10 relative mt-6">
             <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:gap-4 transition-all cursor-pointer">
                Explore tech <ArrowRight size={14} />
             </span>
          </div>
        </div>

        {/* 3. Analytics Card */}
        <div ref={addToRefs} className="md:col-span-4 md:row-span-1 premium-card !bg-slate-900 text-white !p-10 flex flex-col justify-between group overflow-hidden border-none">
           <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                 <BarChart3 size={28} />
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                 Realtime
              </div>
           </div>
           <div>
             <h3 className="text-3xl font-black font-heading leading-tight mb-3">Live Insights</h3>
             <p className="text-slate-400 text-sm font-medium mb-6">Granular tracking of origin, device, and behavior for every engagement.</p>
             <div className="flex items-end gap-1.5 h-10">
                {[4,8,6,10,7].map((h, i) => (
                   <div key={i} className={`w-1 bg-indigo-500/40 group-hover:bg-indigo-400 transition-all duration-500`} style={{ height: `${h * 10}%` }}></div>
                ))}
             </div>
           </div>
        </div>

        {/* 4. Engine Detail */}
        <div ref={addToRefs} className="md:col-span-6 md:row-span-1 premium-card !p-12 border-slate-100 bg-white flex flex-col justify-center">
           <div className="flex items-center gap-10">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center shrink-0 border border-emerald-100 text-emerald-600">
                <Globe size={40} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-3xl font-black font-heading mb-3 tracking-tight">Global Routing Layer</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">Low-latency edge redirection service ensuring your links resolve in under 20ms worldwide.</p>
              </div>
           </div>
        </div>

        {/* 5. Security Summary */}
        <div ref={addToRefs} className="md:col-span-3 md:row-span-1 premium-card !bg-amber-50 border-amber-100 !p-10 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 text-amber-500">
             <ShieldCheck size={36} />
          </div>
          <h3 className="text-2xl font-black font-heading mb-1">Secure Core</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 opacity-80">Encryption first</p>
        </div>

        {/* 6. Testimonial */}
        <div ref={addToRefs} className="md:col-span-3 md:row-span-1 premium-card border-slate-100 !bg-white !p-10 flex flex-col justify-between">
           <Typography.Text className="!font-bold !italic !text-slate-600 !leading-relaxed !text-lg !m-0">
             "The advanced referral tracking is a game changer for our growth team."
           </Typography.Text>
           <div className="flex items-center gap-4 mt-8">
             <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden grayscale">
                <img src="https://i.pravatar.cc/100?img=12" alt="avatar" />
             </div>
             <div>
               <p className="font-black text-sm m-0 text-slate-900">Alex Rivera</p>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product at Linear</span>
             </div>
           </div>
        </div>

      </div>

      <footer className="mt-24 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl w-full text-slate-400">
         <p className="text-xs font-bold font-mono">© 2026 JUGAADLINK CLOUD INC.</p>
         <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Infrastructure</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Global Network</a>
         </div>
      </footer>
    </div>
  );
}