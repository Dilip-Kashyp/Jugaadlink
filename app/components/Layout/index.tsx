"use client";
import React from 'react';
import Navbar from './Navbar';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
};
