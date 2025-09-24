'use client';

import { useState, useEffect } from 'react';
import { Bell, Settings, User, Moon, Sun } from 'lucide-react';
import { PrimaryButton } from './ui/PrimaryButton';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  onProfileClick?: () => void;
}

export function Header({ 
  title, 
  subtitle, 
  showProfile = true, 
  onProfileClick 
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="bg-primary text-white p-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h1 className="display text-white">{title}</h1>
          {subtitle && (
            <p className="text-white/80 mt-1">{subtitle}</p>
          )}
        </div>
        
        {showProfile && (
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10 touch-manipulation"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10 touch-manipulation"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button 
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10 touch-manipulation"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={onProfileClick}
              className="border-white/30 text-white hover:bg-white hover:text-primary"
              aria-label="Open profile menu"
            >
              <User className="h-4 w-4 mr-1" />
              Profile
            </PrimaryButton>
          </div>
        )}
      </div>
    </header>
  );
}
