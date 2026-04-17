"use client";
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Button from './Button';

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      onClick={toggleTheme}
      icon={theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
      className={`!flex !items-center !justify-center !transition-colors ${className}`}
    />
  );
}
