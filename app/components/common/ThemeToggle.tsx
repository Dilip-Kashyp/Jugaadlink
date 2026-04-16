"use client";
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Button from './Button';

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      icon={theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      className={`!rounded-none !border-[var(--border-width)] !border-[var(--border-default)] !shadow-[var(--shadow-solid-sm)] hover:!bg-[var(--primary)] transition-all ${className}`}
    >
      <span className="ml-2 font-bold uppercase text-xs tracking-widest hidden md:inline">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </Button>
  );
}
