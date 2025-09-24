'use client';

import { ThemeProvider } from '@/components/ThemeProvider';

// MiniKit integration temporarily removed for development

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="healthconnect-theme">
      {children}
    </ThemeProvider>
  );
}
